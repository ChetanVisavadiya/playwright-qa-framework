// Declarative pipeline. Requires on the Jenkins controller:
//   - NodeJS plugin with a tool named "NodeJS-22"
//   - JUnit plugin (built in) and, optionally, HTML Publisher plugin
pipeline {
  agent any

  tools { nodejs 'NodeJS-22' }

  options {
    timeout(time: 30, unit: 'MINUTES')
    timestamps()
  }

  environment {
    CI = 'true'
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
        sh 'npx playwright install --with-deps chromium firefox'
      }
    }

    stage('Typecheck') {
      steps { sh 'npm run typecheck' }
    }

    stage('API tests') {
      steps { sh 'npx playwright test --project=api' }
    }

    stage('UI tests') {
      steps { sh 'npx playwright test --project=chromium --project=firefox' }
    }
  }

  post {
    always {
      junit allowEmptyResults: true, testResults: 'test-results/junit.xml'
      archiveArtifacts artifacts: 'playwright-report/**, test-results/**', allowEmptyArchive: true
    }
  }
}
