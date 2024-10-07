locals {
  stack_name        = "auth"
  microservice_type = "app"
  node_selector     = "frontend"


  tags = {
    env     = var.env
    service = local.service_name
  }
  env               = var.env
  service_name      = "${local.stack_name}_${local.microservice_type}"
}