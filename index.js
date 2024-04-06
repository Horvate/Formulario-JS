const $title                 = $('#title');
const $stepText              = $('#step-text');
const $stepDescription       = $('#step-description');
const $stepOne               = $('.step.one');
const $stepTwo               = $('.step.two');
const $stepThree             = $('.step.three');
const $inputNome             = $('#nome');
const $inputSobrenome        = $('#sobrenome');
const $inputDataNascimento   = $('#dataNascimento');
const $minLengthText         = 2;
const $minLengthTextArea     = 10;
const $inputEmail            = $('#email');
const $inputMinibio          = $('#minibio');
const $containerBtnFormOne   = $('#containerBtnFormOne');
const $btnFormOne            = $('#btnFormOne');
const $containerBtnFormTwo   = $('#containerBtnFormTwo');
const $btnFormTwo            = $('#btnFormTwo');
const $containerBtnFormThree = $('#containerBtnFormThree');
const $btnFormThree          = $('#btnFormThree');
const $inputComplemento      = $('#complemento');
const $inputEndereco         = $('#endereco');
const $inputCidade           = $('#cidade');
const $InputCep              = $('#cep');
const $inputPontos           = $('#pontosForte');
const $inputHabilidades      = $('#habilidades');
const emailRegex             =   /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const cepRegex             = /^([\d]{2})([\d]{3})([\d]{3})|^[\d]{2}.[\d]{3}-[\d]{3}/;




let nomeValido           = false;
let sobrenomeValido      = false;
let emailValido          = false;
let dataNascimentoValido = false;
let enderecoValido       = false;
let cidadeValido         = false;
let cepValido            = false;
let pontosValido         = false;
let habilidadesValido    = false; 


function validarInput(element, minlength, maxLength, RegEx){
  const closest = $(element).closest('.input-data');
  if(!element.value 
     || (minlength && element.value.trim().length < minlength)
     || (maxLength && element.value.trim().length > maxLength)
     || (RegEx && !element.value.toLowerCase().match(RegEx))
     ){
     closest.addClass('error');
    return false;
  }
  closest.removeClass('error');
  return true;
}

function iniciarPasso3(){
  $stepText.text('Passo 3 de 3 - Conte-nos sobre você');
  $stepDescription.text('Não economize palavras, aqui é onde você pode se destacar.');
  $stepOne.hide();
  $stepTwo.hide();
  $stepThree.show();

  $inputPontos.keyup(function(){
    pontosValido = validarInput(this, $minLengthTextArea);
    validarFormulario3();
  });

  $inputHabilidades.keyup(function(){
    habilidadesValido = validarInput(this, $minLengthTextArea);
    validarFormulario3();
  });
}

function validarFormulario3(){
  if(pontosValido && habilidadesValido){
      $containerBtnFormThree.removeClass('disabled');
      $btnFormThree.removeClass('disabled');
      $btnFormThree.off('click').on('click', salvarNoTrello);
    }else{
      $containerBtnFormThree.addClass('disabled');
      $btnFormThree.addClass('disabled');
      $btnFormThree.off('click');
    }
  }


function iniciarPasso2(){
  $stepText.text('Passo 2 de 3 - Dados pessoais');
  $stepDescription.text('Precisamos desses dados para que possamos entrar em contato.');
  $stepOne.hide();
  $stepTwo.show();

  $inputEndereco.keyup(function(){
    enderecoValido = validarInput(this, $minLengthTextArea);
    validarFormulario2();
  });

  $inputComplemento.keyup(function(){
    validarFormulario2();
  });

  $inputCidade.keyup(function(){
    cidadeValido = validarInput(this, $minLengthText);
    validarFormulario2();
  });

  $InputCep.keyup(function(){
    this.value = this.value.replace(/\D/g, '');
    cepValido = validarInput(this, null, null, cepRegex);
    if(cepValido){
      this.value = this.value.replace(cepRegex, "$1.$2-$3");
    }
    validarFormulario2();
  });

  function validarFormulario2(){
    if(enderecoValido && cidadeValido && cepValido){
      $containerBtnFormTwo.removeClass('disabled');
      $btnFormTwo.removeClass('disabled');
      $btnFormTwo.off('click').on('click', iniciarPasso3);
    }else{
      $containerBtnFormTwo.addClass('disabled');
      $btnFormTwo.addClass('disabled');
      $btnFormTwo.off('click');
    }
  }
}

function finalizarFormulario(){
  $stepThree.hide();
  $stepDescription.hide();
  $title.text('Muito obrigado pela sua inscrição');
  $stepText.text('Entraremos em contato assim que possível, nosso prazo médio de resposta é de 5 dias. Fique atento na sua caixa de email.');
}

async function salvarNoTrello(){

 try{
   const nome = $inputNome.val();
   const sobrenome = $inputSobrenome.val();
   const email = $inputEmail.val();
   const dataNascimento = $inputDataNascimento.val();
   const minibio = $inputMinibio.val();
   const endereco = $inputEndereco.val();
   const complemento = $inputComplemento.val();
   const cidade = $inputCidade.val();
   const cep = $InputCep.val();
   const habilidades = $inputHabilidades.val();
   const pontosForte = $inputPontos.val();

   if(!nome || !sobrenome || !email || !dataNascimento || !endereco || !cidade || !cep || !habilidades || !pontosForte || !minibio || !complemento){
     return alert('Favor preencher todos os dados obrigatórios para seguir.');
   }

   const body = {
     nome: "Candidato -" + nome,
     desc: `Seguem daods pessoais do candidato(a):

       ---------------Dados pessoais--------------
       
       Nome: ${nome}
       Sobrenome: ${sobrenome}
       Email: ${email}
       Data de Nascimento: ${dataNascimento}
       minibio: ${minibio}

       ---------------Dados de endereço--------------

        Endereço: ${endereco}
        Complemento: ${complemento}
        Cidade: ${cidade}
        CEP: ${cep}

        ---------------Dados do candidato--------------

         Habilidades: ${habilidades}
         Pontos forte: ${pontosForte}`  
   };

   await fetch('https://api.trello.com/1/cards?idList=660b51cf85cf44b66228d444&key=17fae4d2062e775671cb628124d788f9&token=ATTA7ca66d66af56b3559bda18a9e1d2b70802eb03b690ed584059b095a3666decf62648E85A', {   
   method: 'POST',
   Headers:{
     "content-type": "application/json",
   },
     body: JSON.stringify(body)
   });

   return finalizarFormulario();
   
 }catch(e){
   console.log('Ocorreu um erro ao salvar no Trello', e);
 }
}

function init(){
  $stepText.text('Passo 1 de 3 - Dados pessoais');
  $stepDescription.text('Descreva seus dados para que possamos te conhecer melhor.');
  $stepTwo.hide();
  $stepThree.hide();

  function validaFormularioUm(){
    if(nomeValido && sobrenomeValido && emailValido && dataNascimentoValido){
      $containerBtnFormOne.removeClass('disabled');
      $btnFormOne.removeClass('disabled');
      $btnFormOne.off('click').on('click', iniciarPasso2);
    }else{
      $containerBtnFormOne.addClass('disabled');
      $btnFormOne.addClass('disabled');
      $btnFormOne.off('click');
    }
  }

  $inputNome.keyup(function(){
    nomeValido = validarInput(this, $minLengthText);
    validaFormularioUm();
  });

  $inputSobrenome.keyup(function(){
    sobrenomeValido = validarInput(this, $minLengthText);
    validaFormularioUm();
  });

    $inputDataNascimento.keyup(function(){
      dataNascimentoValido = validarInput(this, $minLengthText);
      validaFormularioUm();
    });
    
    $inputDataNascimento.change(function(){
      dataNascimentoValido = validarInput(this, $minLengthText);
      validaFormularioUm();
    });

  $inputDataNascimento.on('focus', function(){
    this.type ='date';
  });

  $inputDataNascimento.on('blur', function(){
    if(!this.value){
    this.type = 'text';
    }
  });

  $inputEmail.keyup(function(){
      emailValido = validarInput(this, null, null, emailRegex);
    validaFormularioUm();
    });

  $inputMinibio.keyup(function(){
    validaFormularioUm();
  });
}

init();