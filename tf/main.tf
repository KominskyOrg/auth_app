provider "aws" {
  region = "us-east-1"
}

data "aws_eks_cluster" "cluster" {
  name = data.terraform_remote_state.infrastructure.outputs.eks_cluster_name
}

data "aws_eks_cluster_auth" "cluster" {
  name = data.terraform_remote_state.infrastructure.outputs.eks_cluster_name
}

provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority[0].data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}

module "eks" {
  source           = "git::https://github.com/KominskyOrg/kom_tf_modules.git//eks@v1.0"
  eks_service_name = "${local.stack_name}-${local.microservice_type}"
  env              = local.env
  ecr_url          = aws_ecr_repository.app_ecr.repository_url
  image_tag        = var.image_tag
  node_selector    = {
    role = "frontend"
  }
}
