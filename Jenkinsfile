// Jenkinsfile
// Declarative Jenkins Pipeline for the Online Attendance Management System
// Stages: Git Clone -> Install Dependencies -> Build (Backend/Frontend) -> Test
//         -> Build Docker Images -> Run Containers -> Deployment Successful

pipeline {
    agent any

    // Tools block assumes NodeJS plugin is configured in Jenkins Global Tool Configuration
    // with an installation named "Node20". Adjust to match your Jenkins setup.
    tools {
        nodejs 'Node20'
    }

    environment {
        BACKEND_IMAGE   = "attendance-backend:${env.BUILD_NUMBER}"
        FRONTEND_IMAGE  = "attendance-frontend:${env.BUILD_NUMBER}"
        DOCKER_COMPOSE  = "docker-compose"
        JWT_SECRET      = credentials('attendance-jwt-secret') // Jenkins credential ID (Secret text)
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Git Clone') {
            steps {
                echo "Cloning repository..."
                checkout scm
                // If pulling from a remote repo directly instead of SCM-configured job:
                // git branch: 'main', url: 'https://github.com/<your-org>/attendance-management.git'
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            echo "Installing backend dependencies..."
                            sh 'npm install'
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            echo "Installing frontend dependencies..."
                            sh 'npm install'
                        }
                    }
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    echo "Backend build step (syntax check / lint placeholder)..."
                    sh 'node -c server.js || true'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    echo "Building React production bundle..."
                    sh 'npm run build'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('backend') {
                    echo "Running backend Jest + Supertest test suite..."
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "Building Docker images for backend and frontend..."
                sh "docker build -t ${BACKEND_IMAGE} ./backend"
                sh "docker build -t ${FRONTEND_IMAGE} -f ./frontend/Dockerfile ./frontend"
            }
        }

        stage('Run Containers') {
            steps {
                echo "Deploying containers using Docker Compose..."
                sh 'docker-compose down --remove-orphans || true'
                sh 'JWT_SECRET=$JWT_SECRET docker-compose up -d --build'
            }
        }

        stage('Deployment Successful') {
            steps {
                echo "======================================================"
                echo " Deployment Successful!"
                echo " Frontend: http://localhost:8080"
                echo " Backend API: http://localhost:5000/api/health"
                echo "======================================================"
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully. Build #${env.BUILD_NUMBER}"
        }
        failure {
            echo "Pipeline failed. Check the stage logs above for details."
        }
        always {
            echo "Cleaning up dangling Docker images..."
            sh 'docker image prune -f || true'
        }
    }
}
