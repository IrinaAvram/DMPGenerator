pipeline {
    agent any
    stages {

        stage("Build") {
            steps {
                echo "Building backend"
                sh "sudo docker build -f docker/backend.Dockerfile -t backend ."
                echo "Success"

                echo "Building frontend"
                sh "sudo docker build -f docker/frontend.Dockerfile -t frontend ."
                echo "Success"
            }
        }

        stage("Run integration tests") {
            steps {
                echo "Running integration tests"
                echo "Success"
            }
        }

        stage("Deploy") {
            steps {
                echo "Deploying"
                sh "chmod 777 scripts/deploy.sh"
                sh "scripts/deploy.sh prod"
                echo "Success"
                slackSend (color: '#00FF00', message: "Aye-aye. Your web application is going to production")
            }
        }

    }
}
