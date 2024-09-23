resource "kubernetes_service" "auth_app_service" {
  metadata {
    name      = "auth-app"
    namespace = var.env
  }

  spec {
    selector = {
      app = "auth-app"
    }

    port {
      name        = "http"
      port        = 8080
      target_port = 3000
    }

    type = "ClusterIP"
  }
}