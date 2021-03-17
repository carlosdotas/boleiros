//**********************************************************************************************************
//Login no sistema
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************
function dadosApp(){
  if(getItem('token')){
    dados = getloading(host+"/api/index.php?token="+getItem('token')+'&login=ok');
    setItem('brasao'   , dados.file_0_name_upload); 
    setItem('nome_App' , dados.nomeApp); 
  }
}
dadosApp();


//**********************************************************************************************************
//Login no sistema
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************
function Login(usuario,senha){
  try {

    if(!usuario,!senha){
      throw 'Login e Senha são Obrigatórios';
    }

    if(getItem('user_login') == 'visitante'){
        apiLogin.nome='visitante';
        loaging('listGames.html');
        return false;
    }


    apiLogin = getloading(host+"/api/login?usuario="+usuario+'&senha='+senha);

    if(apiLogin.nome){



      setItem('user_id', apiLogin.id);
      setItem('user_login', usuario);
      setItem('user_senha', senha);
      setItem('user_nome', apiLogin.nome);
      setItem('user_nivel', apiLogin.nivel);
      setItem('user_status', apiLogin.status);

    

      setItem('user_params_multiplicador_maximo', apiLogin.user_params_multiplicador_maximo);
      setItem('user_params_premio_maximo', apiLogin.user_params_premio_maximo);
      setItem('user_params_minimo_jogos', apiLogin.user_params_minimo_jogos);
      setItem('user_params_maximo_jogos', apiLogin.user_params_maximo_jogos);
      setItem('user_params_aposta_minima', apiLogin.user_params_aposta_minima);
      setItem('user_params_aposta_maxima', apiLogin.user_params_aposta_maxima);
      setItem('user_params_aposta_1jogo', apiLogin.user_params_aposta_1jogo);
      setItem('user_params_maximo_odd', apiLogin.user_params_maximo_odd);
      setItem('user_params_imprimir_segunda_via', apiLogin.user_params_imprimir_segunda_via);
      setItem('user_params_permitido_cancelar', apiLogin.user_params_permitido_cancelar);
      //setItem('user_params_imprimir_campeonato', apiLogin.params.imprimir_campeonato);
      setItem('user_params_nome_sistema_cliente', apiLogin.user_params_nome_sistema_cliente);

   
      loaging('listGames.html');

    }else{
      throw 'Login e Senha são Obrigatórios';
    }

  }catch (error) {

    loaging('login.html');

  }
}

//**********************************************************************************************************
//Logoff no sistema
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************
function Logoff(){
  delItem('user_id'); 
  delItem('user_login');
  delItem('user_senha');
  delItem('user_nome');
  delItem('user_nivel');
  delItem('user_status');
  loaging('login.html'); 
  console.log('Logoff');
}

function Visitante(){
  setItem('user_login', 'visitante');
  setItem('user_senha', 'visitante');
  setItem('user_nome', 'visitante');
  setItem('user_id', '0');
  setItem('user_nivel', '1');

  setItem('user_params_multiplicador_maximo', 600);
  setItem('user_params_premio_maximo', 20000);
  setItem('user_params_minimo_jogos', 1);
  setItem('user_params_maximo_jogos', 15);
  setItem('user_params_aposta_minima', 2);
  setItem('user_params_aposta_maxima', 500);
  setItem('user_params_aposta_1jogo', 1000000);
  setItem('user_params_maximo_odd', 15);

  //var apiLogin = {};
 
 // var apiLogin.params.multiplicador_maximo = getItem('user_params_aposta_maxima');

  loaging('listGames.html'); 

  document.location.reload(true);

}

//**********************************************************************************************************
//Verifica se Esta Logado
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************

function Token(token){
  try {
    if(!token){
      throw 'Token é Obrigatório!';
    }
    dados = getloading(host+"/api/index.php?token="+token+'&login=ok');
    if(dados.status=='ok'){
      setItem('token'    , token); 
      setItem('brasao'   , dados.file_0_name_upload); 
      setItem('nome_App' , dados.nomeApp); 
      setItem('api_url' , dados.url_api); 
      setItem('api_padrao' , dados.site_padrao); 
      Login();
    }else{
      $('#token').val('');
      throw dados.error;
    }

  }
  catch (error) {
    alertView('',error);
  }
}


//**********************************************************************************************************
//Função de Apostas
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************
function apostasAdd(jogo){
  jogo = JSON.parse(jogo);
  apostas[jogo[0]] = jogo; 
  console.log(apostas);
}

function apostasRemove(id){
  delete apostas[id];
  calculaRating();
  console.log(apostas);
}

function apostasRemoveAll(){
  delete apostas;
  console.log(apostas);
}

function apostasView(){ 
  $(".botaoApostaAction").removeClass("selecton");
  $.each( apostas, function( keys, vals ) {
    $('#'+vals[1]+keys).addClass("selecton");
  }); 
}

function apostasEnviar(){
  $.messager.progress();
  var jogosPost = [];
  var x=0;
  //console.log(apiLogin);
  var valorAposta = $('#finalValAposta').val();
  var clientAposta = $('#cliente').val();

  if(!clientAposta) clientAposta = 'Cliente a Vulso';

  if(convertMoedaNunbem(apiLogin.saldo)<=totais.valor && getItem('usuario') != 'visitante' ){
    alertView('','Limite insuficiente para realizar essa operação!');
    $.messager.progress('close');
    return false;
  }

  if((totais.valor)<=1){
    alertView('','O Valor da aposta deve ser que R$2.00');
    $.messager.progress('close');
    return false;
  }

  if(apiLogin.nome=="visitante"){
    //apiLogin.id = "-2";
    var url = 'http://dotas.com.br/fea/api/bilhetes_visitante';
  }else{
    var url = 'http://dotas.com.br/fea/api/bilhetes_cambista';
  }

  console.log(apiLogin);

  $.each( apostas, function( keys, vals ){

    jogosPost[x++] = '{"jogoId":"'+vals[0]+'","taxa":"'+vals[2]+'","texto_aposta":"'+vals[1]+'","oddId":"'+vals[5]+'"}';


  });

  console.log(jogosPost);

  if( getItem('typeTerminal')=='mq'  ){
    if(totais.valor>=(creditos+0.01)){
      alertView('Por favor Adicione mais Crêditos!','Crêditos Insuficiênte!');
      $.messager.progress('close');
      return false;
    }

  }

  getloading(url+'/{"cliente":"'+clientAposta+'","valor_aposta":"'+totais.valor+'","login":"'+getItem('user_login')+'","senha":"'+getItem('user_senha')+'","id_usuario":"'+apiLogin.id+'","apostas":['+jogosPost.join(",")+']}', function( data ) {

    creditosAdd(-data.valor_aposta);

    //console.log(data);

    apiLogin.saldo = data.saldo;

    if(data.message){
      alertView('Código de bilhete:'+data.codigo,data.message);
    }

    //if(!data.apostas && !data.message){
    //  alertView('','Bilhete não processado pelo servidor!');
    //}

    // http://localhost/api/http://dotas.com.br/fea/api/bilhetes_cambista/%7B%22cliente%22:%22Cliente%20a%20Vulso%22,%22valor_aposta%22:%222.00%22,%22login%22:%22cambistateste1%22,%22senha%22:%22cambistateste1%22,%22id_usuario%22:%2210001%22,%22apostas%22:[%7B%22jogoId%22:%2260839%22,%22taxa%22:%221.71%22,%22texto_aposta%22:%22empate%22%7D,%7B%22jogoId%22:%2261285%22,%22taxa%22:%221.44%22,%22texto_aposta%22:%22empate%22%7D,%7B%22jogoId%22:%2263678%22,%22taxa%22:%221.10%22,%22texto_aposta%22:%22casa%22%7D,%7B%22jogoId%22:%2264798%22,%22taxa%22:%222.59%22,%22texto_aposta%22:%22empate%22%7D]%7D?token=2024

    bilhete = ticketGerar(
      apostas,
      data.cliente,
      data.bilhete,
      data.vendedor,
      data.data,
      data.valor_aposta,
      data.valor_retorno,
      data.rating
      );



    if(data.bilhete){

      if( getItem('typeTerminal')=='mq'  ){

        bilhete = ticketGerar(
          apostas,
          data.cliente,
          data.bilhete,
          data.vendedor,
          data.data,
          data.valor_aposta,
          data.valor_retorno,
          data.rating,
          true
        );

        apostas = {};
        totais = {};
        jogoView = {};
        calculaRating();


        setTimeout(function() {
          imprimir(bilhete);
          document.location.reload(true);           
        }, 10);
       
        return false;  
      }

      $.messager.progress('close');

      if(!data.vendedor)data.vendedor = "VISITANTE";

      if(getItem('user_login') == 'visitante'){
        compartilhar(bilhete);
      }else{
        //window.AppInventor.setWebViewString(localStorage.getItem('impressao')+'||'+bilhete);
      }

      if( getItem('typeTerminal')=='mq'  || getItem('user_login') == 'visitante'){
        document.location.reload(true);
      }else{
        apostasImprimir(data.bilhete);
      }


      apostas = {};
      totais = {};
      jogoView = {};
      calculaRating();

    }else{
      $.messager.progress('close');
      alertView('','Erro ao enviar bilhete ao servidor');

    }
  }); 
}


function apostasValidar(){ 

  getloading(host+'/api/validar/'+apiLogin.id+'/'+$('#consultarBilhete').val(), function( data ) {
    if(data[0].msg){
      alertView('',data[0].msg);
      return false;
    }else{
      apostasImprimir($('#consultarBilhete').val());
    };
    console.log(data);    
  });
}





var bilheteSelect;
function apostasConsulta(bilhete){  
  bilheteSelect = '';

  $('#viewBilhete,toolbar').hide();
  getloading(host+'/api/bilhete_validar/?usuario='+getItem('user_login')+'&senha='+getItem('user_senha')+'&bilhete='+bilhete, function( data ) {
    console.log(data);

    if(data[0]){
      alertView('','Bilhete Inexistente');
      return false;
    };

    bilheteSelect = bilhete;

    $('#viewBilhete,toolbar').show();

    $.each( data, function( key, val ) {
      $('#'+key).html(val);
    });

    //if(val.status=='NAO')val.status='ERROU';
    //if(val.status=='SIM')val.status='ACERTOU';

    $('#listaApostasBilhete').html('');   
    $.each( data.aposta, function( key, val ) {
      $('#listaApostasBilhete').append(`
        <table ><tr>
        <td>
        <div>`+val.data+`</div>
        <div><b>`+val.jogos+`</b></div>
        <div>Seleção: `+val.desc+`</div>
        </td>
        <td width="110" >
        <table>
        <tr>
        <td align="right"><b>`+val.taxa+`</b></td>
        <td align="right"><div class="`+val.status+`">ABERTO</div></td>
        </tr>
        </table>
        </td>
        </table ></tr>`);
    });

  });   
}

function creditosAdd(add=0){

  if(add){
    creditos = (creditos-0) + add;
    localStorage.setItem('creditos', creditos);
  }
  
  $('.creditos').val(creditos);

  console.log(creditos);

  if(getItem('espelhaValor')=='s'){
    totais.valor = creditos;
  };

  calculaRating(); 

}


















































var qntCaixa = {};
function caixaList(from,to,user){
   getloading(host+'/api/caixa/'+$('#dataFrom').val()+'/'+$('#dataTo').val()+'/'+apiLogin.id+'?usuario='+getItem('user_login')+'&senha='+getItem('user_senha'), function( data ) {

        //$.each( data.resumo, function( key, val ) {
          //$('#'+key).html('R$ '+(val-0).toFixed(2));
        //})

        console.log(data);
        $('#listApostasCaixa').html('');
        qntCaixa.todos = 0;
        qntCaixa.errou = 0;
        qntCaixa.acertou = 0;
        qntCaixa.aberto = 0;
        qntCaixa.cancelou = 0;
        var premios = 0;

        $.each( data.lista_bilhetes.reverse()  , function( key, val ) {
          qntCaixa.todos++;
          if(val.status_bilhete=='ERROU'){qntCaixa.errou++;}
          if(val.status_bilhete=='ACERTOU'){
            qntCaixa.acertou++;
            premios = premios + (val.premio_bilhete-0);
          }
          if(val.status_bilhete=='CANCELOU'){qntCaixa.cancelou++;}
          if(val.status_bilhete=='ABERTO'){qntCaixa.aberto++;}

          $('#listApostasCaixa').append(`<tr class="linhasCaixa Selc_`+val.status_bilhete+`" onclick="apostasImprimir('`+val.numero_bilhete+`');" ><td><div class="`+val.status_bilhete+`"></div></td><td width="1">`+dataBr(val.data_bilhete)+`</td><td>`+val.numero_bilhete+`</td><td>`+val.cliente_bilhete+`</td><td>`+val.aposta_bilhete+`</td><td>`+val.premio_bilhete+`</td></tr>`);

      });

        $('#premio').html('R$ '+(premios-0).toFixed(2));
        $('#apostado').html('R$ '+(data.resumo.apostado-0).toFixed(2));
        $('#comissao').html('R$ '+(data.resumo.comissao-0).toFixed(2));
        var liquido = ((data.resumo.apostado-0)-((data.resumo.comissao-0)+(premios-0))).toFixed(2);
        if(liquido>>0){
          $('#liquido').attr('class','fontGreen');         
        }else{
          $('#liquido').attr('class','fontRed');
           liquido = -liquido;
        }
        $('#liquido').html('R$ '+liquido);

        $('#selectFiltroApostas').html('<option value="TODOS" id="" >Todos('+qntCaixa.todos+')</option>');
        $('#selectFiltroApostas').append('<option value="ACERTOU" > GANHOU('+qntCaixa.acertou+')</option>');
        $('#selectFiltroApostas').append('<option value="ERROU" > PERDEU('+qntCaixa.errou+')</option>');
        $('#selectFiltroApostas').append('<option value="ABERTO" >  ABERTO('+qntCaixa.aberto+')</option>');
        $('#selectFiltroApostas').append('<option value="CANCELOU" >CANCELOU('+qntCaixa.cancelou+')</option>');

    });

}

function caixaListFiltro(value){
  if(value=='TODOS'){
    $('.linhasCaixa').show();
    return false;
  }
  $('.linhasCaixa').hide();
  $('.Selc_'+value).show();
}





function reimprimirBilhete(compatilhar=false){

  bilhete = ticketGerar(
    ultimoBilhete.apostas,
    ultimoBilhete.cliente,
    ultimoBilhete.bilhete,
    ultimoBilhete.vendedor,
    ultimoBilhete.data,
    ultimoBilhete.valor_aposta,
    ultimoBilhete.valor_retorno,
    ultimoBilhete.rating
    )

  if(compatilhar==true){
  


    compartilhar(bilhete);
  }else{
//    tipo = getItem('impressao');
    imprimir(bilhete);
  }


  
  //window.AppInventor.setWebViewString(tipo+'||'+bilhete);
}




var ultimoBilhete = {};
function apostasImprimir(bilhete){    

  loaging('viewBilhete.html');  
  
  getloading(host+'/api/reimprime_bilhete/'+bilhete, function( data ) {

    console.log(data);    

    ultimoBilhete = data;

    data.status=='SIM';

    data.data = dataBr(data.data);

    setTimeout(function(){
      $.each( data, function( key, val ) {
        $('#'+key).html(val);
      });




    $('#listaApostasBilhete').html('');   
    ultimoBilhete.apostas = {};   

    console.log(data.aposta);

    $.each( data.aposta, function( key, val ) {

      ultimoBilhete.apostas[key] = [val.jogoId,val.desc,val.taxa,val.jogos,val.data];

      if(val.status_aposta == null ){
        color='amarelo';
        results = "ABERTO";
      }


      if(val.status_aposta=='NAO' ){
        color='vermelho';
        results = "PERDEU";
        data.status = "NAO";
      }

      if(val.status_aposta=='SIM'){
        color ='azul';  
        results = "GANHOU";
      }

      var jogosx = [];
      var placarx = [];

      jogosx = val.jogos.split(" x ");
      if(val.placar){
        placarx = val.placar.split(":");
        var placarRecov = placarx[1].split("(");
        placarx[1] = placarRecov[0];
      }else{
        placarx[0] = '';
        placarx[1] = '';
      }


      $('#listaApostasBilhete').append(`
        <table ><tr>
        <td>
        <div>`+val.data+`</div>
        <div><b>`+jogosx[0]+` `+placarx[0]+` X `+placarx[1]+` `+jogosx[1]+` </b></div>
        <div>Seleção: `+val.desc+`</div>
        </td>
        <td width="110" >
        <table>
        <tr>
        <td align="left"  width="80" style="padding-right:15px;"><b>`+(val.taxa-0).toFixed(2)+`</b></td>
        <td align="right" width="80"> <div align="center" class="arredondado `+color+`">`+results+`</div></td>
        </tr>
        </table>
        </td>
        </table ></tr>`);
    });   

    if(data.status=='NAO'){
      data.statusBilhete='PERDEU';
      $('.statusBilhete').html('PERDEU');
      $('.statusBilhete').addClass('vermelho');
      $('.statusBilhete').removeClass('statusBilhete');
    }

    if(data.status=='SIM'){
      $('.statusBilhete').html('GANHOU');
      $('.statusBilhete').addClass('azul');
      $('.statusBilhete').removeClass('statusBilhete');
    }


    console.log(ultimoBilhete); 
  });
    }, 300)

}








//**********************************************************************************************************
//Funções de Calculos
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************
function calculaRating(){
  totais.rating = 1;
  totais.qnt=0; 
  $.each(apostas, function(index, val) {
    totais.rating = ((totais.rating-0) + (totais.rating*(val[2]-1)));
    totais.qnt++;
  }); 

  if(totais.rating>=(getItem('user_params_multiplicador_maximo')-0)){
    totais.rating = (getItem('user_params_multiplicador_maximo')-0);
  }

  if(!totais.valor) totais.valor =0;

  totais.rating  = (totais.rating-0).toFixed(2);
  totais.qnt     = (totais.qnt-0).toFixed(0);
  totais.valor   = (totais.valor-0).toFixed(2);
  //if(getItem('creditos')){
    //creditos       = getItem('creditos')-0;
  //}
  


  $('.rating').val(totais.rating);
  $('.rating').html(totais.rating);
  $('.qnt').val(totais.qnt);
  $('.qnt').html(totais.qnt);
  $('.valor').val('R$ '+totais.valor);
  $('.valor').html('R$ '+totais.valor); 
  $('.creditos').val(creditos.toFixed(2));

  calculaPremio();
  return totais;
}

function calculaPremio(){

  totais.premio = (totais.valor-0) * totais.rating;

  if(totais.premio>=(getItem('user_params_premio_maximo')-0))totais.premio = (getItem('user_params_premio_maximo')-0);
  

  totais.premio = (totais.premio-0).toFixed(2); 

  $('.premio').val('R$ '+totais.premio);
  $('.premio').html('R$ '+totais.premio); 
  return totais;
}


//**********************************************************************************************************
//Funcoes de Validação de Conteudo
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************
function validado(result,erro){

  if(result == 0   && erro=='noSelect'){alertView('','Nenhuma seleção foi realizada!');return false;}
  if(result <= 1.8 && erro=='noRating' && Object.keys(apostas).length <= 1){alertView('','O Odds não pode ser Inferiror a 1.8');return false;}
  if(result >= (getItem('user_params_maximo_jogos')-0)+1  && erro=='maximoOdd'){alertView('','O maximo de apostas por bilhete é: '+(getItem('user_params_maximo_odd')-0));return false;}

  return true;
}


//**********************************************************************************************************
//Funções de Tickets
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************
function ticketGerar(
  apostas,
  cliente='Cliente',
  codigo='XXXXXXXXXX',
  vendedor,
  data,
  valor_aposta,
  valor_retorno,
  rating,
  codes=false
  ){

  bilhete = '';

  var linhas = '';

  var codigo = codigo;
  var cliente = cliente;
  var cambista = vendedor;
  var data = data;

  var content = '';

  $.each( apostas, function( keys, vals ){
    linhas += `\n`;
    linhas += vals[3]+`\n`;
    linhas += 'Vencedor:'+vals[1]+`\n`;
    linhas += `Taxa: `+((vals[2]-0).toFixed(2))+`\n`;
    linhas += 'Data:'+vals[4]+`\n`;
  });

  console.log(apostas);

  var codesCenter = '';
  var codesLogo = '';
  var codesMedium3 = '';
  var codesBold = '';
  var codesLeft = '';
  var codesBig = '';
  var codesQrm = '';

/*
  if(codes==true){

    codesCenter = '<CENTER>';
    codesLogo = '<IMAGE>http://www.boleirosbr.com.br/app/src/imgs/brasao.jpg';
    codesMedium3 = '<MEDIUM3>';
    codesBold = '<BOLD>';
    codesLeft = '<LEFT>';
    codesBig = '<BIG>';
    codesQrm = '<QR-M>';
    
  }
*/

  var x = 1;

  if(!cambista)cambista="Pre Bilehete";

  bilhete += `\n`;
  bilhete += codesCenter+codesLogo+`\n`;
 // bilhete += codesMedium3+codesCenter+getItem('nome_App').toUpperCase()+`\n`;
  bilhete += codesBold+codesCenter+`APOSTAS ESPORTIVAS\n`;
  //bilhete += `==============================\n`;
  bilhete += codesLeft+`DATA: `+dataHora(data)+`\n`;
  bilhete += `CLIENTE: `+cliente+`\n`;
  bilhete += `OPERADOR:`+cambista+`\n`;
  //bilhete += `==============================\n`;
  bilhete += `\n`;
  bilhete += `       CODIGO DO BILHETE\n`;
  bilhete += `\n`;
  bilhete += codesBig+codesCenter+``+codigo+`\n`;
  bilhete += `\n`;
  //bilhete += codesCenter+codesQrm+codigo+`\n`;
  //bilhete += `==============================\n`;
  bilhete += `\n`;
  bilhete += `          SUA SELECAO\n`;
  bilhete += linhas;
  bilhete += `\n`;
  bilhete += `\n`;
  //bilhete += content
  //bilhete +=  `==============================\n`;
  bilhete += `Qtd. Jogos:`+totais.qnt+`\n`;
  bilhete += `Total Apostado:R$ `+((valor_aposta-0).toFixed(2))+`\n`;
  bilhete += `Premio Liquido:R$ `+((valor_retorno-0).toFixed(2))+`\n`;
  bilhete += `\n`;
  bilhete += `Confira seu bilhete premio \n`;
  bilhete += `valido somente com \n`;
  bilhete += `apresentacao do comprovante\n`;
  bilhete +=  `\n`;
  if(getItem('telefone')){
    bilhete += `Consulte as regras em nosso\n`;
    bilhete += `pelo telefone:\n`;
    bilhete += getItem('telefone').split('/')[2]+`\n`;
  }
  bilhete += `GANHOU RECEBEU\n`;
  bilhete += `PAGAMENTO EM ATE 48 HORAS!\n`;
  bilhete += `\n`;
  bilhete += `          Volte sempre\n`;
  bilhete += `\n\n\n\n\n`;


  console.log(bilhete);

  return bilhete;
}


function compartilhar(content){
  window.AppInventor.setWebViewString('compartilhar||'+content);
}

function imprimir(bilhete){
  window.AppInventor.setWebViewString(getItem('impressao')+'||'+bilhete);
}












//**********************************************************************************************************
//Listar Ligas
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************

function ligasSelect(){
  $('#ligaBusca').html(`<option value="">Todos os Jogos</option><option value="hoje">Jogos de Hoje</option> `);
  $.each( ligas, function( key, val ) {
    $('#ligaBusca').append(`<option value="`+val+`">`+val+`</option>`);
  });
}

//**********************************************************************************************************
//Listar Jogos
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************
function listarJogos(filtro='',liga="",page=1){ 

  if(page==1){$('#listadejogos').html('');}

  var l=0;  
  var v=0

  if(!apiJogos){
  var apiJogos = getloading(host+"/api/jogos");
  }

  //console.log(apiJogos);
  
  $.each( apiJogos, function( key, val ) {

    ligas[l++] = key;
    var ligaSelect = key;
    var ligaView ='';
    var x=0;

    $.each( val, function( key, val ) {

      //console.log(dataIg(val.data_hora).split(" ")[0]+'='+data());
      //console.log(val.data_hora);
      setTimeout(function(){
        if(
          (val.jogo_nome.toLowerCase().indexOf(filtro.toLowerCase()) != -1 && !liga) ||
          (dataIg(val.data_hora).split(" ")[0]==data() && $('#ligaBusca').val()=='hoje') ||
          (ligaSelect == liga)           
          ){

          //if(v<=(page*50)-1 && v >= ((page*50)-50)){
            if(ligaView!=ligaSelect){
              $('#listadejogos').append(`<tr><td colspan="5" ><div class="claro titles" >`+ligaSelect+`</div></td></tr><tr class="subTop"><td width="200" align="center">Jogos</td><td width="50" align="center">Casa</td><td width="50" align="center">Emp.</td><td width="50" align="center">Fora</td><td width="50" align="center">Mais</td>             
                </tr>`);
              ligaView=ligaSelect;
            }


            $('#listadejogos').append(`<tr><td width="100%" ><div align="center"><b class="listJogoTimes jogo`+val.jogo_id+`">`+val.jogo_nome+`</b><div class="descrt1">`+val.data_hora+`</div></div></td>
              <td width="50" class=""><button value='["`+val.jogo_id+`","casa","`+val.casa+`","`+val.jogo_nome+`","`+val.data_hora+`","`+val.casa_id+`"]'   type="casa" id="casa`+val.jogo_id+`"       id_odd="`+val.casa_id+`"      ref="`+val.jogo_id+`" class="botaoAposta botaoApostaAction botaoApostaSelect`+val.jogo_id+`"  >`+val.casa+`</button></td>
              <td width="50" class=""><button value='["`+val.jogo_id+`","empate","`+val.empate+`","`+val.jogo_nome+`","`+val.data_hora+`","`+val.empate_id+`"]' type="empate" id="empate`+val.jogo_id+`" id_odd="`+val.empate_id+`"  ref="`+val.jogo_id+`" class="botaoAposta botaoApostaAction botaoApostaSelect`+val.jogo_id+`" >`+val.empate+`</button></td>
              <td width="50" class=""><button value='["`+val.jogo_id+`","fora","`+val.fora+`","`+val.jogo_nome+`","`+val.data_hora+`","`+val.fora_id+`"]'   type="fora"   id="fora`+val.jogo_id+`"     id_odd="`+val.fora_id+`"     ref="`+val.jogo_id+`" class="botaoAposta botaoApostaAction botaoApostaSelect`+val.jogo_id+`" >`+val.fora+`</button></td>
              <td width="25" class=""><button onclick='jogoView=["`+val.jogo_id+`","`+val.data_hora+`","`+val.jogo_nome+`"];loaging("maisJogos.html","#contenerIndex");' class="botaoMais">+</button></td></tr>`);
            x++;
          //}
          v++;
        }
      }, (x*50));
      
    });
    setTimeout(function(){apostasView();},50);
  }); 



  if(inicio==0){
    ligasSelect(ligas); 
  }     
  inicio++;
}










//**********************************************************************************************************
//Eventos do Sistema
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************
$(document).delegate('#formLogin', "submit", function (event) {
  event.preventDefault();
  Login($('#usuario').val(),$('#senha').val());
});  

$(document).delegate('#formToken', "submit", function (event) {
  event.preventDefault();
  Token($('#token').val());
});  



$(document).delegate('.fim_close', "click", function (event) {
  $.messager.progress();
  $('#jogo'+$(this).attr('value')).remove();
  delete apostas[$(this).attr('value')];
  delete apostas[$(this).attr('value')];  
});

$(document).delegate('.botaoApostaAction', "click", function (event) {

  if(!$( this ).hasClass( "selecton" )){
    apostasAdd($(this).val());
  }else{
    apostasRemove($(this).attr('ref'));
  }
  $.messager.progress();
  apostasView();
  $.messager.progress('close');
  //apostasListar();
  calculaRating();
});

$(document).delegate('.creditos', "click", function (event) {  
  //creditosAdd(1);
}); 

$(document).delegate('.bntFinalizar', "click", function (event) {
  if(
    validado(Object.keys(apostas).length,'noSelect') &&
    validado(($('.rating').val()-0),'noRating') &&
    validado(Object.keys(apostas).length,'maximoOdd') 
    ){

    loaging('finalizar.html?'+Math.random(),'#contenerIndex');   
}
}); 
$(document).delegate('.bntMenu', "click", function (event) {

  if(getItem('typeTerminal')=='mq'){   
    var senha = (prompt('Digite a senha de Administrador')==getItem('senha'));
  }else{
    var senha = true;
  }

  if(senha){
    $('#menu').dotasMenu();
    open();
  }
});


$(document).delegate(document, "keyup", function (event) {
  if(event.keyCode == 115){//ao Pressionar a tecla F4
    if(getItem('typeTerminal')=='mq'){
      creditosAdd(1);
    }
  }
});

$(document).delegate(document, "keyup", function (event) {
  if(event.keyCode == 13){
    document.activeElement.blur();
  }
});