resource "aws_ecr_repository" "auth_app" {
  name                 = "auth_app_${local.env}"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = local.tags
}
