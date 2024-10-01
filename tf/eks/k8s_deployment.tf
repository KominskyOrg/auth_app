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
            name = "AUTH_API_URL"
            value = "https://${var.env}.jaredkominsky.com/api/auth"
          }

          env {
            name  = "NODE_ENV"
            value = var.env == "staging" ? "development" : var.env == "prod" ? "production" : var.env
          }

          readiness_probe {
            http_get {
              path = "/health"
              port = 3000
            }
            initial_delay_seconds = 10
            period_seconds        = 10
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 3
          }

          liveness_probe {
            http_get {
              path = "/health"
              port = 3000
            }
            initial_delay_seconds = 30
            period_seconds        = 30
            timeout_seconds       = 5
            success_threshold     = 1
            failure_threshold     = 3
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
  description = "Names of the auth-app pods"
  value       = kubernetes_deployment.auth_app.spec[0].template[0].metadata[0].labels["app"]
}
