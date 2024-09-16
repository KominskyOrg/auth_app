resource "kubernetes_service" "auth_app_service" {
  metadata {
    name      = "auth-app-service"
    namespace = var.env
  }

  spec {
    selector = {
      app = kubernetes_deployment.auth_app.metadata[0].labels["app"]
    }

    port {
      port        = 80
      target_port = 3000
    }

    type = "LoadBalancer"
  }
}

output "auth_app_service_url" {
  description = "The external URL of the auth_app service"
  value       = kubernetes_service.auth_app_service.load_balancer_ingress[0].hostname
}
