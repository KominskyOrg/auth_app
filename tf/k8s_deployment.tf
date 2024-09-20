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
          image = "${aws_ecr_repository.auth_app.repository_url}:${var.image_tag}"

          port {
            container_port = 3000
          }

          env {
            name  = "NODE_ENV"
            value = var.env == "dev" ? "development" : var.env == "prod" ? "production" : var.env
          }
        }

        node_selector = {
          Name = "frontend"
        }
      }
    }
  }
}

output "auth_app_pod_names" {
  description = "Names of the auth_app pods"
  value       = kubernetes_deployment.auth_app.spec[0].template[0].metadata[0].labels["app"]
}
