module.exports = {
  apps: [
    /**
     * exec_mode: 'cluster'를 이용하여 클러스터 모드로 동작
     * push-scheduler는 2개 스레드에서 동작, api server는 4개 스레드에서 동작하는 형태
     */
    {
      name: 'api-server',
      script: './server.js',
      namespace: 'API-server',
      instance_var: 'INSTANCE_ID',
      version: '1.0.0',
      instances: 4,
      exec_mode: 'cluster',
      wait_ready: true, // 마스터 프로세스에게 ready 이벤트 대기
      listen_timeout: 50000, // ms ... ready 이벤트를 기다릴 시간값
      kill_timeout: 5000, // ms ... SIGINT 시그널을 보낸 후 프로세스가 종료되지 않았을 때 SIGKILL 시그널을 보내기까지의 대기 시간
      autorestart: false,
      watch: false,
    },
    {
      name: 'push-scheduler',
      script: './pushScheduler.js',
      namespace: 'push-server',
      instance_var: 'INSTANCE_ID',
      version: '1.0.0',
      instances: 1,
      exec_mode: 'cluster',
      wait_ready: true, // 마스터 프로세스에게 ready 이벤트 대기
      listen_timeout: 50000, // ms ... ready 이벤트를 기다릴 시간값
      kill_timeout: 5000, // ms ... SIGINT 시그널을 보낸 후 프로세스가 종료되지 않았을 때 SIGKILL 시그널을 보내기까지의 대기 시간
      autorestart: false,
      watch: false,
    },
  ],
};
