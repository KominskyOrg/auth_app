resource "kubernetes_deployment" "auth_app" {
  metadata {
    name      = "auth-app"
    namespace = var.env
    labels = {
      app = "auth-app"
    }
  }

  spec {
    replicas = var.replicas

    selector {
      match_labels = {
        app = "auth-app"
      }
    }

    template {
      metadata {
        labels = {
          app = "auth-app"
        }
      }

      spec {
        container {
          name  = "auth-app"
          image = "${var.auth_app_ecr_url}:latest"

          port {
            container_port = 3000
          }

          env {
            name  = "NODE_ENV"
            value = var.env == "staging" ? "development" : var.env == "prod" ? "production" : var.env
          }
        }

        node_selector = {
          role = "frontend"
        }
      }
    }
  }
}

output "auth_app_pod_names" {
  description = "Names of the auth_app pods"
  value       = kubernetes_deployment.auth_app.spec[0].template[0].metadata[0].labels["app"]
}
