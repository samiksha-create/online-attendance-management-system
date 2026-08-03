pipeline {
    agent any

    tools {
        nodejs 'Node20'
    }

    stages {

        stage('Clone Code') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }

        stage('Install Backend') {
            steps {
                dir('backend') {
                    echo 'Installing backend packages...'
                    sh 'npm install'
                }
            }
        }

        stage('Install Frontend') {
            steps {
                dir('frontend') {
                    echo 'Installing frontend packages...'
                    sh 'npm install'
                }
            }
        }

        stage('Backend Check') {
            steps {
                dir('backend') {
                    echo 'Checking backend...'
                    sh 'node --version'
                    sh 'npm --version'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('frontend') {
                    echo 'Building React app...'
                    sh 'npm run build'
                }
            }
        }

        stage('Success') {
            steps {
                echo '''
                ===========================
                BUILD SUCCESSFUL
                Online Attendance System
                ===========================
                '''
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished'
        }

        success {
            echo 'SUCCESS: Jenkins pipeline completed'
        }

        failure {
            echo 'FAILED: Check logs'
        }
    }
}