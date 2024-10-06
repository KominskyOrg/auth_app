locals {
  tags = {
    env     = var.env
    service = "${local.stack_name}_${local.microservice_type}"
  }
  env               = var.env
  stack_name        = "auth"
  microservice_type = "app"
  service_name      = "${local.stack_name}_${local.microservice_type}"
}