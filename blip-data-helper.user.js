// ==UserScript==
// @name         Blip Data Helper
// @namespace    http://gouvea77.com
// @version      1.4
// @description  Script para auxiliar no Blip
// @author       Gabriel Gouvea
// @match        https://medgrupocentral.desk.blip.ai/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/gouvea77/blip-data-helper/main/blip-data-helper.user.js
// @downloadURL  https://raw.githubusercontent.com/gouvea77/blip-data-helper/main/blip-data-helper.user.js
// ==/UserScript==


(function () {
  "use strict";
  alert("estou sendo atualizado automaticamente, testado e revisado")
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
          let idTicket = document.querySelector("#idTicket").innerText;
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
    textoAtendimentos.innerText =
      "Atendimentos Hoje: " + atendimentosDia.length;

    let tabela = "";

    if (alunosFiltrados.length === 0) {
      tabela = "Nenhum atendimento realizado hoje";
    } else {
      tabela = `
    <style>
      .divTeste {
  width: 100%;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-size: 15px;
  margin: 0 auto;
  max-height: 240px;
  overflow-y: scroll;
}

.divTeste table {
  width: 65%;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin: 0 auto;
}

.divTeste thead {
  background-color: #1A5ED4;
  color: #fff;
  text-align: left;
}

.divTeste th,
.divTeste td {
  padding: 14px 18px;
}

.divTeste tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s ease;
  background-color: #f9fafb;
}

.divTeste tbody tr:hover {
  background-color: #e0f2fe;
}

.divTeste th {
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 16px;
}

.divTeste td {
  color: #374151;
  position: relative;
  font-size: 13px;
}

.divTeste td:first-child {
  padding-right: 2px;
}

.copiar {
  background-color: #1A5ED4;
  opacity: 0;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  font-size: 10px;
  color: white;
  z-index: 10;
  position: absolute;
  right: 8px;
  bottom: 79%;
  pointer-events: auto;
  transition: opacity 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15); /* sombra discreta */
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
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Telefone</th>
        </tr>
      </thead>
      <tbody>
        ${alunosFiltrados
          .map(
            (aluno) => `
          <tr>
            <td>
               <div class="selecionar">
                 <div class="selecionado">
                </div>
                </div>
              ${aluno.id}
            </td>
            <td>${aluno.nome}</td>
            <td>${aluno.telefone}<div class="copiar">COPIAR</></td>
          </tr>
        `
          )
          .join("")}
      </tbody>
  `;
    }

    novaDiv.innerHTML = tabela;
    divBlip.appendChild(novaDiv);
    btnCopy();
  }

  function btnCopy() {
    let copyBtn = document.querySelectorAll(".copiar");

    copyBtn.forEach((copiar) => {
      let td = copiar.closest("tr");
      td.addEventListener("mouseenter", () => {
        copiar.style.opacity = "1";
      });
      td.addEventListener("mouseleave", () => (copiar.style.opacity = "0"));

      copiar.addEventListener(
        "mouseenter",
        () => (copiar.style.color = "black")
      );
      copiar.addEventListener(
        "mouseleave",
        () => (copiar.style.color = "white")
      );
      copiar.addEventListener("click", (e) => {
        // copia a linha toda da tabela
        let linha = e.target.closest("tr");
        e.target.innerText = "COPIADO!";
        function changeInnerText() {
          e.target.innerText = "COPIAR";
        }
        setTimeout(changeInnerText, 1000);
        navigator.clipboard.writeText(linha.innerText.replace("COPIADO!", ""));
      });
    });
  }
})();









