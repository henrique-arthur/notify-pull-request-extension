(async () => {
  console.log('executando verificador de pipeline');
  checkPullRequestStatus();
  // document.querySelector("span[title='Status: Open']") PR ABERTA
  // document.querySelector("span[title='Status: Merged']") PR MERGEADA
  // document.querySelector("span[title='Status: Closed']") PR FECHADA

  // document.querySelector('div.gh-header-show > div > h1.gh-header-title') BUSCAR TÍTULO DA PR
  // Array.from(comentario de cima.children) transformar o titulo em um array de elementos
  // capturar o innerText do título e do código da pr ex: #442

  const getGithubPipelineStatus = () => document.querySelector('.mergeability-details.js-details-container.Details div:nth-child(2).branch-action-item.js-details-container.Details > div:nth-child(2) > h3.h4.status-heading')
  const finishedPipelineStatus = ['All checks have passed', 'Some checks were not successful'];

  const verifyIfElementIsLoaded = null;

  // let verifyIfElementIsLoaded = setInterval(() => {
  //   if (checkIfElementIsLoaded()) {
  //     clearInterval(verifyIfElementIsLoaded);
  //     checkElementActualStatus();
  //   }
  // }, 10000);

  const checkPullRequestStatus = () => {
    const pullRequestStatus = document.querySelectorAll('span[title*="Status"]')[0].textContent.trim();

    const handleByPullRequestStatus = {
      'Open': handleOpenedPullRequest,
      'Merged': () => { },
      'Closed': () => { },
    }

    return handleByPullRequestStatus[pullRequestStatus]();
  }

  const handleOpenedPullRequest = () => {
    verifyIfElementIsLoaded = setInterval(() => {
      if (checkIfElementIsLoaded()) {
        clearInterval(verifyIfElementIsLoaded);
        checkElementActualStatus();
      }
    }, 10000);
  }

  const checkIfElementIsLoaded = () => {
    if (getGithubPipelineStatus()) {
      console.log('elemento carregado');

      if (finishedPipelineStatus.includes(getGithubPipelineStatus()?.textContent)) {
        console.log('Elemento com status finalizado, verificando mudanças no DOM');
        return false;
      }

      return true;
    }
    console.log('elemento não carregado');
    return false;
  }

  const checkElementActualStatus = () => {
    let interval = setInterval(() => {
      checkIfPullRequestIsReady(interval);
    }, 1000);
  };

  const checkIfPullRequestIsReady = (interval) => {
    // const githubStatusText = document.querySelector('.mergeability-details.js-details-container.Details div:nth-child(2).branch-action-item.js-details-container.Details > div:nth-child(2) > h3.h4.status-heading')?.textContent
    const githubStatusText = getGithubPipelineStatus()?.textContent;
    if (githubStatusText === 'Some checks haven’t completed yet') {
      console.log('rodando pipeline')
    }
    else if (githubStatusText === 'Some checks were not successful') {
      console.log('pipeline falhou');
      notifyMe('Sua PR não passou na pipeline :/');
      clearInterval(interval);
    } else if (githubStatusText === 'All checks have passed') {
      console.log('passou');
      notifyMe('Sua PR passou!');
      clearInterval(interval);
    }
  };

  async function notifyMe(text) {
    if (!("Notification" in window)) {
      console.error("Notifications not supported");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const notification = new Notification(text);
        notification.onclick = function () {
          window.focus();
        };
      } else {
        console.warn("Notification permission denied");
      }
    } catch (error) {
      console.error("Failed to request notification permission:", error);
    }
  }

})()


// content.js

// Listener para receber mensagens do background.js
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log('foi aq no ')
//   if (request.message === 'executeContentScript') {
//     // Executa a lógica desejada aqui
//     console.log('Script de conteúdo executado na página do pull request do GitHub.');
//   }
// });


// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log('from background script: ' + message)
//   sendResponse('message recieved')
// });