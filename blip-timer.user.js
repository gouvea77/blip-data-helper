// ==UserScript==
// @name         Blip - Adiciona Timer
// @namespace    http://gouvea77.com
// @version      1.0
// @description  Script para auxiliar no Blip adicionando um timer
// @author       Gabriel Gouvea
// @match        https://medgrupocentral.desk.blip.ai/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/gouvea77/blip-helper/main/blip-timer.user.js
// @downloadURL  https://raw.githubusercontent.com/gouvea77/blip-helper/main/blip-timer.user.js
// ==/UserScript==


(function () {
  "use strict";
  console.log("Script carregado no Blip Desk");
  let t = 0;

  setInterval(() => {
    const texto = document.querySelector(
      "[name='message-active']"
    ).nextElementSibling;
    const ticketsString = document.querySelector("#all-tickets-chip").innerText;
    const nAtendimentos = +ticketsString.charAt(7);
    const label = document.querySelector("#waiting-tickets-label");
    const clients = parseInt(
      document.querySelector("#waiting-tickets-count").innerText
    );


    cenarios(texto, label, clients, nAtendimentos);
  }, 3000);

  function preencheTexto(label, texto, msgLabel, msgTexto) {
    texto.innerText = msgTexto;
    if (label) {
      label.innerText = msgLabel;
    }
  }

  function cenarios(texto, label, clients, nAtendimentos) {
    if (nAtendimentos === 0 && clients === 0) {
      //Cenário 1: SEM aluno aguardando e SEM atendimentos aberto 
      t = 0;
      preencheTexto(texto, label, "Script Rodando", "Sem BLIP aguardando");
    } else if (clients > 0 && nAtendimentos === 0) {
      //Cenário 2: atendimento aguardando e SEM atendimentos no momento 
      preencheTexto(
        texto,
        label,
        `Entrou Blip há ${t} segundos`,
        `BLIP há ${t} segundos`
      );
      t += 5;
    } else if (clients > 0 && nAtendimentos > 0) {
      //Cenário 3: atendimento aguardando e COM atendimento aberto
      preencheTexto(texto, label, ``, `Entrou Blip há ${t} segundos`);
      t += 5;
    } else {
      //Cenário 4: SEM atendimento aguardando e COM atendimento aberto 
      preencheTexto(texto, label, "", "Sem BLIP aguardando");
      t = 0;
    }
  }
})();
