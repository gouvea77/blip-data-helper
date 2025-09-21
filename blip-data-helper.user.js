// ==UserScript==
// @name         Blip - Cria Tabela de Atendimentos
// @namespace    http://gouvea77.com
// @version      1.7
// @description  Script para auxiliar no Blip
// @author       Gabriel Gouvea
// @match        https://medgrupocentral.desk.blip.ai/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/gouvea77/blip-data-helper/main/blip-data-helper.user.js
// @downloadURL  https://raw.githubusercontent.com/gouvea77/blip-data-helper/main/blip-data-helper.user.js
// ==/UserScript==


(function () {
  "use strict";

  let atendimentosDia = JSON.parse(localStorage.getItem("atendimentos")) || [];

  function limparLocalStorage() {
    let alunos = JSON.parse(localStorage.getItem("alunos")) || [];
    let dataHoje = new Date();
    let dia = dataHoje.getDate();
    let mes = dataHoje.getMonth() + 1;
    const alunosDia = alunos.filter((aluno) => {
      return aluno.data === dia + "/" + mes;
    });

    alunos = alunosDia;
    localStorage.setItem("alunos", JSON.stringify(alunos));
  }

  limparLocalStorage();

  const observer = new MutationObserver((mudancas, obs) => {
    const divAlunos = document.querySelector(".divTeste");
    let dataHoje = new Date();
    let dia = dataHoje.getDate();
    let mes = dataHoje.getMonth() + 1;

    mudancas.forEach((mudanca) => {
      mudanca.addedNodes.forEach((node) => {
        if (node.innerText && node.innerText.includes("Ticket")) {
          let textoAtendimentos = document.querySelector(".header-content");
          let idTicket = document.querySelector(
            "#ticket-sequential-id"
          ).innerText;
          addAlunos(dia, mes);
          if (
            idTicket != "" &&
            !atendimentosDia.some(
              (atendimento) => atendimento.idTicket === idTicket
            )
          ) {
            atendimentosDia.push({
              idTicket,
              data: dia + "/" + mes,
            });
            localStorage.setItem(
              "atendimentos",
              JSON.stringify(atendimentosDia)
            );
          }
        }
      });
    });
    if (!divAlunos) {
      criarDiv();
    }
  });

  observer.observe(document.body, {childList: true, subtree: true});

  let alunos = JSON.parse(localStorage.getItem("alunos")) || [];

  function addAlunos(dia, mes) {
    alunos = JSON.parse(localStorage.getItem("alunos")) || [];
    const nomeAluno = document
      .querySelectorAll(".profile-info-item")[0]
      .innerText.replace("Nome:", "")
      .trim();

    const textoCpf =
      document.querySelectorAll(".profile-info-item")[3].innerText;
    const textoId =
      document.querySelectorAll(".profile-info-item")[7].innerText;
    const telefoneTexto =
      document.querySelectorAll(".profile-info-item")[2].innerText;
    const telefoneAluno = telefoneTexto.replace(/\D/g, "");

    let cpfAluno = textoCpf.replace(/\D/g, "");

    let idAluno = textoId.replace(/\D/g, "");
    if (!idAluno || idAluno === "0" || idAluno.length > 6) {
      idAluno = "-";
    }
    if (!cpfAluno || cpfAluno === "0") cpfAluno = "-";

    console.log(telefoneAluno);
    console.log(alunos);
    console.log(nomeAluno);

    if (
      !alunos.some(
        (aluno) =>
          aluno.telefone === telefoneAluno && aluno.data === dia + "/" + mes
      )
    ) {
      alunos.push({
        nome: nomeAluno,
        cpf: cpfAluno,
        id: idAluno,
        data: dia + "/" + mes,
        telefone: telefoneAluno,
      });
      localStorage.setItem("alunos", JSON.stringify(alunos));
    }
    console.log("local storage definido");
    criarDiv();
  }

  function criarDiv() {
    let textoAtendimentos = document.querySelector(".header-content");

    let dataHoje = new Date();
    let diaHoje = dataHoje.getDate();
    let mesHoje = dataHoje.getMonth() + 1;

    const alunosArray = JSON.parse(localStorage.getItem("alunos")) || [];
    const alunosFiltrados =
      diaHoje && mesHoje
        ? alunosArray.filter((aluno) => aluno.data === diaHoje + "/" + mesHoje)
        : alunosArray;
    let divBlip = document.querySelector(".header-chat-list");
    if (!divBlip) return;

    let antiga = document.querySelector(".divTeste");
    if (antiga) antiga.remove();

    let novaDiv = document.createElement("div");
    novaDiv.className = "divTeste";
    atendimentosDia = JSON.parse(localStorage.getItem("atendimentos")) || [];
    textoAtendimentos.innerText =
      "Atendimentos Hoje: " + atendimentosDia.length;

    let tabela = "";

    if (alunosFiltrados.length === 0) {
      tabela = "Nenhum atendimento realizado hoje";
    } else {
      tabela = `
    <style>
 .tabela {
      width: 350px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      font-family: Arial, sans-serif;
    }

    .linha {
      display: grid;
      grid-template-columns: 1fr 2fr 2fr;
      border-bottom: 1px solid #ddd;
      position: relative;
      z-index: 3;
    }

    .cabecalho {
      background: #1976d2;
      color: white;
      font-weight: bold;
      position: sticky;
      top: 0;
      z-index: 2;
    }

    .col {
      padding: 8px 12px;
      text-align: center;
    }

    .corpo {
      max-height: 120px;
      /* altura da área rolável */
      overflow-y: auto;
      background: white;
    }

    .linha:nth-child(even) {
      background: #f9f9f9;
    }

.linha {
  position: relative; /* cria referência */
  z-index: 1;
}

.copiar {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #1A5ED4;
  color: white;
  padding: 5px;
  border-radius: 4px;
  font-size: 10px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 1000; /* bem alto dentro do mesmo stacking context */
}


.selecionar{
    background-color: white;
    border-radius: 50%;
    height: 15px;
    position: absolute;
    width: 15px;
    left: 2px;
    cursor: pointer;
    border: 0.5px solid black;
    opacity: 0;

}

.selecionado{
   background-color: #1A5ED4;
    border-radius: 50%;
    height: 11px;
    position: absolute;
    width: 11px;
    left: 1px;
    cursor: pointer;
    border: 0.5px solid black;
    bottom: 1px;
    opacity: 0;
}

    </style>
    <div class="tabela">
  <!-- Cabeçalho -->
  <div class="linha cabecalho">
    <div class="col">ID</div>
    <div class="col">Nome</div>
    <div class="col">Telefone</div>
  </div>

      <div class="corpo">
        ${alunosFiltrados
          .map(
            (aluno) => `
      <div class="linha">
        <div class="col">${aluno.id}</div>
        <div class="col">${aluno.nome}</div>
        <div class="col">${aluno.telefone}<div class="copiar">COPIAR
          </div>
        </div>
      </div>

        `
          )
          .join("")}
      </div>
      </div>
  `;
    }

    novaDiv.innerHTML = tabela;
    divBlip.appendChild(novaDiv);
    btnCopy();
  }

  function btnCopy() {
    let copyBtn = document.querySelectorAll(".copiar");

    copyBtn.forEach((copiar) => {
      let linha = copiar.closest(".linha"); // ✅ linha correta do botão

      linha.addEventListener("mouseenter", () => {
        copiar.style.opacity = "1";
      });
      linha.addEventListener("mouseleave", () => (copiar.style.opacity = "0"));

      copiar.addEventListener(
        "mouseenter",
        () => (copiar.style.color = "black")
      );
      copiar.addEventListener(
        "mouseleave",
        () => (copiar.style.color = "white")
      );

      copiar.addEventListener("click", (e) => {
        e.target.innerText = "COPIADO!";
        setTimeout(() => (e.target.innerText = "COPIAR"), 1000);

        navigator.clipboard.writeText(linha.innerText.replace("COPIADO!", ""));
      });
    });
  }
})();












