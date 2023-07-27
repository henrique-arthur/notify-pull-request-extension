// background.js

// Função para verificar se a URL corresponde ao padrão esperado
function isGitHubPullRequestUrl(url) {
  // Verifica se a URL corresponde a "https://github.com/{company}/{repository}/pull/{id}"
  const regex = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)$/;
  console.log('eh pr ' + regex.test(url));
  return regex.test(url);
}

// Função para injetar o script de conteúdo na página
function injectContentScript(tab) {
  // chrome.tabs.sendMessage(tab.id, { message: 'executeContentScript' });
  // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //   chrome.tabs.sendMessage(tabs[0].id, { message: 'executeContentScript' });
  // });

  chrome.runtime.onMessage.addListener((isLoaded, sender, sendResponse) => {
    if (isLoaded) {
      (async () => {
        const response = await chrome.tabs.sendMessage(tab.id, { message: 'executeContentScript' });
        console.log(response);
      })();
    }
  });
}

// Listener para quando uma nova aba é criada
chrome.tabs.onCreated.addListener(injectContentScript);

// Listener para quando o estado de uma aba é alterado (ex: URL muda)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Verifica se a aba foi carregada completamente
  if (changeInfo.status === 'complete') {
    // Verifica se a URL corresponde ao padrão esperado
    console.log('verificando se é pr ' + tab.url);
    if (isGitHubPullRequestUrl(tab.url)) {
      // Injeta o script de conteúdo na aba atual
      injectContentScript(tab);
    }
  }
});
