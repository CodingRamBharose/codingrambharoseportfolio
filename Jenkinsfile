pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/CodingRamBharose/codingrambharoseportfolio.git', branch: 'main'
            }
        }
        stage('Build') {
            steps {
                echo "Building the Portfolio Website..."
                // Example for Node.js app
                // sh 'npm install'
                // sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                echo "Running tests..."
                // sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                echo "Deploying Portfolio Website v1.0"
                // In real deployment, run copy/scp/docker/k8s steps here
            }
        }
    }
}
