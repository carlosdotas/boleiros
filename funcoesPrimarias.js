
var limpar = 1;
//var timer;
function tecladoNumber(num,obj){

	//clearTimeout(timer);
	//timer = setTimeout(function(){limpar=1},10000);

	if(limpar==1){
		totais.valor = 0;
		$(obj).val(totais.valor);limpar=0;
	}

	var total = ((totais.valor-0)+(num-0));
	if(num!=0){	
		$(obj).val('R$ '+(total.toFixed(2)));
		totais.valor = total;
	}else{
		totais.valor = 0;
		$(obj).val('R$ '+((totais.valor).toFixed(2)));
	}
	calculaRating();
}

function tecladoText(text,obj){

	if(text=='DEL'){$(obj).val(text=$(obj).val().slice(0, -1));return false;}
	if(text=='0'){$(obj).val('');return false;}

	$(obj).val(($(obj).val()+text));

}

//**********************************************************************************************************
//SetCookie
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************
function setCookie(cname, cvalue, exdays=1000) {
	localStorage.setItem(cname, cvalue);
	/*var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	*/
}

function getCookie(cname) {

	localStorage.getItem(cname);
	/*
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
	*/
}

function checkCookie() {
	var user = getCookie("username");
	if (user != "") {
		alert("Welcome again " + user);
	} else {
		user = prompt("Please enter your name:", "");
		if (user != "" && user != null) {
			setCookie("username", user, 365);
		}
	}
}


//**********************************************************************************************************
//Storage Datas
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************
function setItem(cname, cvalue) {
	var type = typeof  cvalue;
	if(cvalue){
		if(type=='object')cvalue = JSON.stringify(cvalue);
		localStorage.setItem(cname, type+'|:'+cvalue);
		return localStorage.getItem(cname);
	}
}

function getItem(cname) {
	var saida = localStorage.getItem(cname);
	if(saida){
	var retorno = saida.split("|:");
	
	if(retorno[0]=='object'){

		try {
		   return JSON.parse(retorno[1]);
		}
		catch (e) {
		   return retorno[1].split(",");
		}

	}

	if(retorno[0]=='number'){
		retorno[1] = retorno[1]-0;
	}

	if(retorno[0]=='boolean'){
		if(retorno[1]='true'){
			retorno[1] = true;
		}else{
			retorno[1] = false;
		}
	}

	return retorno[1];
	}
}

function delItem(cname) {
	localStorage.removeItem(cname);
}


//**********************************************************************************************************
//Função de Tratamento de Erros!
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************
var errorSystem = function(sintaxi,msg,funcaoErro,funcaoOK){

	
	if(!sintaxi){
		if(funcaoOK)funcaoOK(sintaxi);
		return sintaxi;
	}else{
		if(funcaoErro)funcaoErro(msg);
		if(msg){
			app.toast.create({
				icon: '<img valingn="center" style="width: 30px; height: 30px;" src="src/imgs/proibido.png">',
				text: msg,
				closeTimeout: 2000}).open();
		}

		throw new Error(msg);
	}
	
}


//**********************************************************************************************************
//Outras Funções
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************
function notificacao(title,text){
	var notificacoes = app.notification.create({
		icon: '<img style="width: 15px; height: 15px;" src="src/imgs/proibido.png">',
		title: title,
		text: text,
		closeTimeout: 3000,
	});
	notificacoes.open();
}


//**********************************************************************************************************
//Outras Funções
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************
function timeConverter(UNIX_timestamp){
	var a = new Date(UNIX_timestamp * 1000);
	var months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dec'];
	var year = a.getFullYear();
	var month = months[a.getMonth()];
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	var time = date + '/' + month + ' ' + ' - ' + hour + ':' + min + ':' + sec ;
	return time;
}

function mktime(){
	a=new Date()
	return parseInt(a.getTime()/1000)
}

function tempoPassado(entrada){
	var segs = mktime()-entrada;
	if( segs <= 60 ) var texto = 'Menos de 1 Minuto';
	if( segs >= 60 ) var texto = 'Em '+parseInt(segs/60)+' Minuto(s)';
	if( segs >= 3600 ) var texto = 'Em '+parseInt(segs/3600)+' Horas(s)';
	if( segs >= 86400 ) var texto = 'Em '+parseInt(segs/86400)+' Dias(s)';

	return texto;
}

function Moeda(moeda){
	moeda = moeda+0;
	return 'R$ '+moeda.toFixed(2);
}

function convertMoedaNunbem(moeda){

	moeda = moeda+'';

	moeda = moeda.replace('R$ ','').replace(',','.');
		
	moeda = moeda - 0;

	return moeda;
}

function dataIg(data){
	date  = data.split(" ");
	saida = date[0].split("/")[2]+'-'+date[0].split("/")[1]+'-'+date[0].split("/")[0];
	return saida;
}


function dataBr(data){
	date  = data.split(" ");
	saida = date[0].split("-")[2]+'/'+date[0].split("-")[1]+' '+date[1].split(":")[0]+':'+date[1].split(":")[1];
	return saida;
}

function tempoMinutos(entrada){
	var segs = mktime()-entrada;
	return parseInt(segs);
}

function formatReal(n, c, d, t) {
	c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "." : d, t = t == undefined ? "" : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

function dataHora(){
	var dNow = new Date();
	return dNow.getDate() + '/' + (dNow.getMonth()+1) + '/' + dNow.getFullYear() + ' ' + dNow.getHours() + ':' + dNow.getMinutes();
}

function data(diasAdd=0){
	var dNow = new Date();
	dNow.setDate(dNow.getDate() + diasAdd);
	return  dNow.getFullYear() + '-' +  ("00" + (dNow.getMonth()+1)).slice(-2) + '-' + ("00" + dNow.getDate()).slice(-2);
}


function w3_open() {
	if(getItem('typeTerminal')=='mq'){  		
		if(prompt('Digita a senha de admin')){
			$('#mySidebar,#myOverlay').show();
		}
	}else{
		$('#mySidebar,#myOverlay').show();
	}
}

function w3_close() {
  $('#mySidebar,#myOverlay').hide();
}


//**********************************************************************************************************
//carrega pagina em String
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************
var getloading = function(url,executar='') {
  var saida;
  var token =  '';
  var separador = "&";
 
  if(url.split("?").length==1){
  	separador = '?';
  };

  if(getItem('token')){
  	token = separador+'token='+getItem('token')
  }


  $.ajax({
    url: url+token,
    type: "GET",
    beforeSend: function () {

		

    },    
    success: function (data, textStatus, jqXHR) {
        saida = data;
        if(executar)executar(data);
 
    },
    dataType: "json",
    error: function (data) {
      alert('Erro ao Conectar');
      //$.messager.progress('close');  
    },
    async: false
  });
  
  return saida;
}


//**********************************************************************************************************
//Carrega Pagina em Elemento Html
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************
function loaging(url,select='#conteudos'){
  $.messager.progress();
  $.get(url+'?'+Math.random(), function( data ) {
  	$.messager.progress('close');
    $(select).html(data);
  });     
}


//**********************************************************************************************************
//Carrega Pagina em Elemento Html
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************
var request = function(url,funcao){
    $.get(url, function( data ) {
    	funcao(data);
  	}); 
}




//**********************************************************************************************************
//Alert
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************

  function alertView(text='',title=''){
    var mktime = 'teste'+Math.floor((Math.random() * 99999) + 1);
    setTimeout(function(){
      $('#'+mktime).hide(300).remove();
    }, 2000);

    $('body').append(`<div id="`+mktime+`" style="display:block;" class="w3-overlay w3-animate-opacity" >
      <div class="w3-display-middle">
      <div class="w3-panel w3-red w3-round-large">
      <h3>`+title+`</h3>
      <p>`+text+`</p>
      </div>
      </div>
      </div>`);    

    $('#'+mktime).click(function(event) {
      $('#'+mktime).hide(300).remove();
    });
  }
