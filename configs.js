//**********************************************************************************************************
//Variaveis de Leitura
//**********************************************************************************************************
//**********************************************************************************************************
//**********************************************************************************************************
//Parametros do Sistema

//Servidor
//**********************************************************************************************************
setItem('host','http://dotas.com.br/fea');

//Api
//**********************************************************************************************************
setItem('token','');
setItem('api_padrao','');
setItem('api_url','');

//APP
//**********************************************************************************************************
setItem('app_nome','');  
setItem('app_brasao','');   
setItem('app_slogan','');   

//Parametros do Usuário
//**********************************************************************************************************
setItem('user_params_multiplicador_maximo', '');
setItem('user_params_premio_maximo', '');
setItem('user_params_minimo_jogos', '');
setItem('user_params_maximo_jogos', '');
setItem('user_params_aposta_minima', '');
setItem('user_params_aposta_maxima', '');
setItem('user_params_aposta_1jogo', '');
setItem('user_params_maximo_odd', '');
setItem('user_params_imprimir_segunda_via', '');
setItem('user_params_permitido_cancelar', '');
setItem('user_params_imprimir_campeonato', '');
setItem('user_params_nome_sistema_cliente', '');

//Parametros do Usuário
//**********************************************************************************************************
setItem('user_type', ["Visitante","Cambista","Gerente","Administrador"]);

//Configuracao
//**********************************************************************************************************
setItem('config_tema', 'escuro');  
setItem('config_espelhar_credito', 'n');  
 
//Listagem de Jogos
//**********************************************************************************************************
setItem('list_jogos', {});  
setItem('list_ligas', {});  



var host  = 'http://dotas.com.br/fea';
var bilhete = '';
var inicio = 0;
var cliente = '';
var apostaValor = 0;
var ratings = 0;

if(localStorage.getItem('creditos')){
   var creditos = (localStorage.getItem('creditos')-0);
}else{
   var creditos = 0;
}

//Variaveis do Sistema
var typeUser = ["Visitante","Cambista","Gerente","Administrador"];
	
//Objetos
var apostas  = {};
var totais 	 = {};
var ligas 	 = {};
var apiLogin = {};
var jogoView = {};

//getCookie('creditos',0);

//Cookies
if(getCookie('typeTerminal'))   var typeTerminal = getCookie('typeTerminal');		
//if(getCookie('creditos'))       var creditos     = getCookie('creditos');      
if(getCookie('token'))          var token        = getCookie('token');      
if(getCookie('impressao'))      var impressao    = getCookie('impressao');	
if(getCookie('apiLogin'))       var apiLogin     = JSON.parse(getCookie('apiLogin'));	

if(!getItem('impressao')){setItem('impressao', 'bt');};   
if(!getItem('typeTerminal')){setItem('typeTerminal', 'pos');};   
if(!getItem('tema')){setItem('tema', 'escuro');};   
if(!getItem('espelhaValor')){setItem('espelhaValor', 'n');};   


if(apiLogin.nome)               var cambista     = apiLogin.nome;	

//Totais
totais.rating = 0;
totais.valor  = 0;
totais.premio = 0;
totais.qnt    = 0;

var dataFrom = 0;
var dataTo =0;

$('#themes').attr('href',"src/css/temas/"+getItem('tema')+".css?"+Math.random());