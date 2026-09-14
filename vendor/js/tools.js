/* 

	Importante !! 

		Precisa montar um dicionário de funções, caso contrario isso vai ficar repleto de funções que 
		fazem a mesma coisa !!!  
		
																					Nell Jr. - Mar/19 

*/

var pictureSource;   
var destinationType; 
var GlobalSource = "";

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function showSnackbar(msg) {
  snackbar.innerHTML = msg;
  snackbar.className = "show";
  setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 4000);
}

function importarContato() {
	var flag =  $.Deferred();
    var retorno = []; 		
	
	if (localizacao != "chrome" ){
		//Verificar plugin  -- Nell Nov/16
		navigator.contacts.pickContact(function(contact){
			retorno = contact ;
			flag.resolve(retorno); 			
		},function(err){
			alert('Error: ' + err);
			flag.resolve(null); 			
		});					
	}
	return $.when(flag).done().promise();
}

function mascara(valor, tipo){
	var retorno = "";
	if (valor != "" && valor != null){
		if (tipo == "cep"){
			retorno = valor.substring(0,5)+"-"+valor.substring(5);
		} else if (tipo == "fone"){
			retorno = "("+valor.substring(0,2) + ") "+valor.substring(2,4)+" " +valor.substring(4,9)+"-"+valor.substring(9,20);
		}		
	}
	return retorno;
}

function mandarEMAIL(imagem, Itens){

	var cvs = document.createElement('canvas');
	var ctx = cvs.getContext("2d");
	ctx.drawImage(imagem, 0, 0, imagem.naturalWidth, imagem.naturalHeight, 0, 0, imagem.width, imagem.height);
	var imgBs64 = cvs.toDataURL();
		
	$.ajax({
		type: 'POST',
		url: 'http://nelltechnology.ddns.net/mysite/emailFromAppMobile.php',               
		error: function(result){
			updateStatus(result,0);				
		},
		crossDomain: true, 
		data: {
			Assunto: Itens[0].Assunto, 
			Mensagem: Itens[0].Mensagem,
			Itens : Itens, 
			Imagem: imgBs64 
		},
		success: function(result){
			updateStatus("Divulgação enviada",1);
		}
	})
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function ObtemImagem(url){
	var canvas = document.createElement("canvas");	
	canvas.setAttribute("width","100");                
	canvas.setAttribute("height","100");	           	                                                   
	context = canvas.getContext("2d");                 	
	var img = document.createElement("img");
	img.src = url; 
	context.drawImage(img,0,0,100,100);	
		
	var dataURL = compressImage(canvas,4);	

	return dataURL;
}

function compressImage(canvas, size) {
	var compression = 1.0;
	while(compression > 0.01) {
		var dataURL = canvas.toDataURL('image/jpeg', compression);
		if (dataURL.length/1012 < size) return dataURL;
		if (compression <= 0.1) {
			compression -= 0.01;
		} else {
			compression -= 0.1;
		}
	}
	return dataURL;
}

var initial_screen_size = {};

function redimensionar() { 
    var percGrid= window.innerHeight / 1000 ;
	
    if (window.innerHeight > initial_screen_size.height && window.innerWidth == initial_screen_size.width){		
		initial_screen_size.is_keyboard = false;
    } else if (window.innerHeight < initial_screen_size.height && window.innerWidth == initial_screen_size.width){
		initial_screen_size.is_keyboard = true;						
	}
	initial_screen_size.height = window.innerHeight;
	initial_screen_size.width = window.innerWidth;	

	if (initial_screen_size.is_keyboard == null){
		initial_screen_size.is_keyboard = false 
	} else {
		var owl = $("#owl-carossel"); 
		owl.trigger('owl.prev');
		setTimeout(function(){
			owl.trigger('owl.next')	
		},100)			
	}

    if (GlobalSource != "") {
    	initial_screen_size.is_keyboard = false ;
		setTimeout(function(){GlobalSource = ""},2000)	    	
    }  

    if (initial_screen_size.is_keyboard) {
		var maxPercGrid=1.2 ;
		$(".header").hide();
		$(".topo").hide();
		$("footer").hide();		
    } else{
		var maxPercGrid=0.80; 	            
		if (window.innerWidth < window.innerHeight){
			percGrid=maxPercGrid;
		}	
		$(".header").show();
		$(".topo").show();
		$("footer").show();		
	}
    
    var gridHeight=(window.innerHeight * percGrid); 
    var formHeight= window.innerHeight;
    var formWidth=window.innerWidth;	
    $(".grid").css({'height': gridHeight + "px"});
	var fieldsetWidth = $("form fieldset").width()+30;
	if ($("#Arrastar").is(':checked')){		
		formHeight = (window.innerHeight * 0.9);		
		formWidth = window.innerWidth * 0.9;		
		$("form").css({'height':formHeight + "px"});
		for (var i=1;i<=4;i++){
			if (window.innerWidth * 0.9>=fieldsetWidth * i){
				formWidth=fieldsetWidth * i;   
			}   			
		}		
	}

	$("form").css({'width':formWidth+'px','height':formHeight+'px'});	
	$(".DivForm").css({'width':formWidth+'px','height': (formHeight * 0.8) +'px'});	
	
	if (window.innerWidth < fieldsetWidth * 2){
		margem = Math.round((window.innerWidth - fieldsetWidth) / 2);
	} else if (window.innerWidth > fieldsetWidth * 2.3 && window.innerWidth <  fieldsetWidth * 3){
		margem = Math.round((window.innerWidth - fieldsetWidth) / 10);		
	} else {
		margem = 3 
	}
	
	$("form fieldset").css({'marginLeft': margem +'px'});
}


function FormAjust(Formulario){
	$("form").each(function(){
        objForm="#"+$(this).attr('id');
		if ($(objForm).is(":visible")) {
			if (Formulario != objForm && parseInt($(objForm).css('z-index'))>=parseInt($(Formulario).css('z-index'))) {
				zindex=parseInt($(objForm).css('z-index'))+1;
				$(Formulario).css('z-index',zindex);	
			}	   
		}	
	});
}

function DialogConfirm(msg){
	var flag = $.Deferred();
	$("#dialog-confirm").html(msg);
	
	$("#dialog-confirm").dialog({
		resizable: false,
		modal: true,
		title: "",
		height: 200,
		width: window.innerWidth-100,
		buttons: {
			"Sim": function () {
				$(this).dialog('close');
				flag.resolve(true);
				
			},
				"Não": function () {
				$(this).dialog('close');
				flag.resolve(false);
			}				
		}
	});

	return $.when(flag).done();
}

function LimparEdicao(Formulario, Fechar){	
	$(Formulario).find('input[type="text"]').val('');
	$(Formulario).find('input[type="number"]').val('');		
	$(Formulario).find('input[type="checkbox"]').prop('checked',false);
	$(Formulario).find("textarea").val('');	
	$(Formulario).find(".disable").remove();
	
	if (Fechar == null || Fechar == true){
		$(Formulario).hide(1500);
	}	

	if (Formulario=="#FormCliente"){
		$("#avatarCliente").attr("class","FotoBotoes");	
		$("#avatarCliente").height("100px");	
		$("#avatarCliente").attr("src","./img/question.png");	
	}
	if (Formulario=="#FormFuncionario"){
        $("#avatarFuncionario").attr("class","FotoBotoes");	
        $("#avatarFuncionario").height("100px");
        $("#avatarFuncionario").attr("src","./img/question.png");	
		$("div .disable").remove();
	}	

	$(Formulario + " .rolagem").scrollTop(10);		
}

function onBackKeyDown(){
	if (FormAtivo == ""){
		if (localizacao == "chrome" ){
			window.history.back();				
		} else {
			navigator.app.exitApp()			
		}
	}else{
		LimparEdicao(FormAtivo);
		FormAtivo="";		
	}	
}

function dragDropImage(Codigo,Entidade,Colecao,Selecao,QueryColecao,QuerySelecao,tamanhoSelecao,tamanhoColecao,MultiSelecionar,UsarJson){

	setTimeout(function(){
		UpdateDivChildren();
	},500);	
	
	if (Codigo==null) Codigo=0;
    if (UsarJson==null) UsarJson = false;
	
	if (UsarJson){
		criarPorJson(QueryColecao,Colecao);
		criarPorJson(QuerySelecao,Selecao);				
	}else{		
		criarPorMySQL(QueryColecao,Colecao);
		criarPorMySQL(QuerySelecao,Selecao);		
	} 

	this.id=function(){
		var Parent=document.getElementById(Selecao);
	    var Child=Parent.getElementsByTagName('div')[0];
		if (Child == undefined) return null ; else return Child.id; 		
	}

	this.nome=function(){
		var Parent=document.getElementById(Selecao);
	    var Child=$(Parent).find("font");
		return $(Child).text(); 
	}

	this.descricao=function(){
		var Parent=document.getElementById(Selecao);
	    var Child=$(Parent).find("#descricao");
		return $(Child).val(); 
	}

	this.palavrasChaves=function(){
		var Parent=document.getElementById(Selecao);
	    var Child=$(Parent).find("#palavrasChaves");
		return $(Child).val(); 
	}

	this.preco=function(){
		var Parent=document.getElementById(Selecao);
	    var Child=$(Parent).find("#preco");
		return $(Child).val(); 
	}
    
	this.avatar=function(){
		var Parent=document.getElementById(Selecao);
	    var Child=$(Parent).find("img");
		return $(Child).prop('src'); 
	}
			
	function UpdateDivChildren(){
		$(".card" + Entidade).click(function(){

			if ($(this).parents().attr("id").substr(0,3) == "Sel") {
				$("#"+Colecao).prepend(this);			
			} else { 
				if (!MultiSelecionar){
					var Parent=document.getElementById(Selecao);
					div=Parent.getElementsByTagName('div');	
					$("#"+Colecao).prepend(div);										
				}				

				$("#"+Selecao).prepend(this) ;			
			}

			formatDroppable();
		}) 
		
		if ($("#"+Colecao).find('div').length == 1 && $("#"+Selecao).find('div').length == 0){
			div = $("#"+Colecao+ " div");	
			$("#"+Selecao).append(div);			
			$("#"+Colecao+" .card" + Entidade).remove();
			$("#"+Selecao).find("img").width(105).height(105);
			formatDroppable();			
		}				
	}
	
	function criarPorJson(json,elemento) {
		$("#"+elemento+" .card"+Entidade).remove();
		if (json==""||json==null) return;		
		var Parent=document.getElementById(elemento);  
		
		$.each(json, function() {	
            var CodEntidade=this.id;
            var CardEntidade="card"+Entidade;						
			var div=MontaImgDragDrop(CodEntidade,CardEntidade,this);
			Parent.appendChild(div)															
		});
		formatDroppable()
	}
		
	function criarPorMySQL(query,elemento) {
		$("#"+elemento+" .card"+Entidade).remove();
		if (query==""||query==null) return;		
		var Parent=document.getElementById(elemento);  
		var vetor=[Codigo];
		if (Codigo==0) vetor=[]; 


	    connection.query(query, vetor, function (err, results) {
			for (var Contador=0; Contador<results.length; Contador++) {
				var row=results[Contador];							
				if (Entidade == "funcionarioEspecialidade") {
					var CodEntidade=row["id_especialidade"]; 							
				}else {
					var CodEntidade=row["id_"+Entidade]; 	
				}						
				var cardEntidade="card"+Entidade; 	

				var div=MontaImgDragDrop(CodEntidade,cardEntidade,row);

				Parent.appendChild(div);												
			}
			formatDroppable();
		});
	}
		
	function formatDroppable(){
		$("#"+Colecao).css("background-color", "white");
		$("#"+Selecao).css("background-color", "white");
		$("#"+Colecao).find("img").width(tamanhoColecao).height(tamanhoColecao); 
		$("#"+Selecao).find("img").width(tamanhoSelecao).height(tamanhoSelecao);
	}	

	function MontaImgDragDrop(CodEntidade,CardEntidade,row){
		var div=document.createElement("div");

		div.setAttribute("id",CodEntidade);
		div.setAttribute("class",CardEntidade);
		div.setAttribute("style","left:0;text-align:center;z-index:1000;margin-right:30px;");		
		
		var Img=document.createElement("img");		
		if (typeof(row.avatar) == "undefined" && row.avatar == null) {
			Img.setAttribute("src",row.avatar);			
		} else {
			Img.setAttribute("src",row.avatar)
		}
		Img.setAttribute("align","middle");

		div.appendChild(Img);					
		
		var nome = row.nome;
        var arrayNome = nome.split(" ")

		$.each(arrayNome, function() {	
		    let palavra =  this.toString();
			if (palavra.length > 8) {
               nome = nome.replace(palavra,"#"+palavra+"#")				
			}
		})

		var arrayFont = nome.split("#")

		$.each(arrayFont, function() {	
		    if (this.length > 0) {
				var Font= document.createElement("font");
				Font.setAttribute("size","1");
				var divText=document.createTextNode(this.toString());					
				var Br=document.createElement("br");								
				Font.appendChild(divText)
				div.appendChild(Br);
				div.appendChild(Font);
		    }  
		})

		var Colunas = Object.keys(row);	
		for (var i in Colunas) {		
			if (Colunas[i]!="avatar" && Colunas[i]!="Foto" && Colunas[i]!="nome" && Colunas[i]!= "Cod"+Entidade){
				var Input=document.createElement("input");
				Input.setAttribute("type","text");
				Input.setAttribute("id",Colunas[i]);
				Input.setAttribute("style","display:none");
				Input.setAttribute("value",row[Colunas[i]]);											
				div.appendChild(Input);								
			}
		}				
		return div
	}	
}

function FormatImgDragDrop(CodEntidade,CardEntidade,avatar,descricao,palavrasChaves,nome,tamanho){
	var div=document.createElement("div");

	div.setAttribute("id",CodEntidade);
	div.setAttribute("class",CardEntidade);
	div.setAttribute("style","text-align:center; z-index:1000");		
	
	var Img=document.createElement("img");
	Img.setAttribute("src",avatar);
	Img.setAttribute("align","middle");	
	Img.setAttribute("width",tamanho);
	Img.setAttribute("height",tamanho);
	
	var Input=document.createElement("input");
	Input.setAttribute("type","text");
	Input.setAttribute("id","descricao");
	Input.setAttribute("style","display:none");
	Input.setAttribute("value",descricao);								

	var Input=document.createElement("input");
	Input.setAttribute("type","text");
	Input.setAttribute("id","palavrasChaves");
	Input.setAttribute("style","display:none");
	Input.setAttribute("value",palavrasChaves);								

	var Br=document.createElement("br");					
	
	div.appendChild(Input);					
	div.appendChild(Img);					

	var Font= document.createElement("font");
	Font.setAttribute("size","1");
	Font.setAttribute("color","white");
	
	var cont=1; 
	for (var i=0;i< nome.length-1;i++){							
		if (nome.substr(i,1)==" "){
			if (cont==3){
				nome=nome.substr(0,i);
				break;
			}else{
				cont += 1;
			}								
		}							
	}							
	var divText=document.createTextNode(nome);					
	Font.appendChild(divText)
	div.appendChild(Br);
	div.appendChild(Font);
	return div;	
}

function formataAnoMesDiaHora(oDia,oHora){
    if (oDia==null) oDia=""; 
	if (oHora==null) oHora=""
	var retorno="";
	
    if (oDia!=""){
		var arrayDia=oDia.split("/")
		var dia= parseInt(arrayDia[0]);
		var mes= parseInt(arrayDia[1]);
		var ano= parseInt(arrayDia[2]);			
		
		if (dia<10) dia="0" + dia;
		if (mes<10) mes="0" + mes;	
						
		retorno=ano+"-"+mes+"-"+dia;
	}
    if (oHora!=""){
		var arrayHora=oHora.split(":");
		var hora= parseInt(arrayHora[0]);
		var minuto= parseInt(arrayHora[1]);
				
		if (hora<10) hora="0" + hora;	
		if (minuto<10) minuto="0" + minuto;		
		
		retorno += " "+hora+":"+minuto;		 		
	}
    return retorno.trim();		
}

function FormataDiaHoraPadraoBrasil(oDia){
	if (oDia==null){
		var Data=new Date();
	}  else {
		var Data=new Date(oDia);				
	}
	this.data=function (){
		var dia=Data.getDate() ;
		if (dia<10) dia="0" + dia ;
		var mes=Data.getMonth() + 1 ; if  (mes<10) mes="0" + mes ;
		strDtPdrBrsl=dia + "/" + mes + "/" + Data.getFullYear();							
        return strDtPdrBrsl;				
	}	
	this.horario=function(){
		var oHora=Data.getHours() ; if  (oHora<10) oHora="0" + oHora ;
		var oMinutos=Data.getMinutes() ; if  (oMinutos<10) oMinutos="0" + oMinutos; 										
        return oHora+":"+oMinutos;		
	}
} 

function isaPhoneNumber(fone) {
    fone=fone.replace("(","");
    fone=fone.replace(")","");
    fone=fone.replace("+","") ; 
    fone=fone.replace(/ /g,'');
    fone=fone.replace(/-/g,'') ;
    if (fone.length<6){return false}
    return !isNaN(parseFloat(fone)) && isFinite(fone);
}

document.addEventListener("deviceready",onDeviceReady,false);    

function onDeviceReady() {
	try{
		if (localizacao != "chrome" ){
			pictureSource=navigator.camera.PictureSourceType;
			destinationType=navigator.camera.DestinationType;
			GlobalSource=""; 						
		}
	}catch (e){
	   alert(e);
	}
}

function onPhotoDataSuccess(imageData) {
	var smallImage = document.getElementById(GlobalSource);
	smallImage.src = "data:image/jpeg;base64," + imageData;
}

function onPhotoURISuccess(imageURI) {
    var largeImage = document.getElementById(GlobalSource);
    largeImage.src = imageURI;
}

function capturePhoto(source) {
	GlobalSource = source; 	
	navigator.camera.getPicture(onPhotoDataSuccess,onFail,{ quality:50,destinationType:destinationType.DATA_URL });
}

function onFail(message) {
	alert('Failed because:' + message);
}

function getPhoto(source) {	  
	GlobalSource=source;
	navigator.camera.getPicture(onPhotoURISuccess,onFail,{ quality:50,destinationType:destinationType.FILE_URI,sourceType:pictureSource.SAVEDPHOTOALBUM});		
}

function obterDiaSemana(numero){
    var dia;
	switch (numero) {
		case 0:
			dia="Dom";
			break;
		case 1:
			dia="Seg";
			break;
		case 2:
			dia="Ter";
			break;
		case 3:
			dia="Qua";
			break;
		case 4:
			dia="Qui";
			break;
		case 5:
			dia="Sex";
			break;
		case  6:
			dia="Sab";
			break;
	}	
	return dia; 
}

function ArrastarForms(Arrastar){
	if(Arrastar)
        $('form').draggable({disabled:false});	
	else 
	    $('form').draggable({disabled:true});	
}

function HabilitarPeriodo(ChkBx){
    var fldst=$(ChkBx).closest("fieldset");	
	var dv=$(fldst).find(".disable");
	if($(ChkBx).is(':checked')){			
		$(dv).remove();
	} else {		
		if (!$(dv).length) {
			var dv=document.createElement("div");
			dv.setAttribute("class","disable");                    
			$(fldst).append(dv);		 
		}		
	}   
}

function HabilitarIntervalo(ChkBx){
    var fldst=$(ChkBx).closest("fieldset");	
	var dv=$(fldst).find(".disable");
	if($(ChkBx).is(':checked')){			
		$(dv).remove();
	} else {		
		if (!$(dv).length) {
			var dv=document.createElement("div");
			dv.setAttribute("class","disable");  			
			dv.style.marginTop = "-200px";
			dv.style.marginLeft = "-3px";
			dv.style.height = "198px";			
			$(fldst).append(dv);		 
		}		
	}   
}

function VisualizarForm(formulario){
	FormAtivo = formulario; 
	FormAjust(FormAtivo);
	if ($("#Arrastar").is(':checked')){
		var mLeft=(window.innerWidth - $("form").width())/2;
		var mTop=(window.innerHeight - $("form").height())/2; 				
	} else {
		var mLeft=0;
		var mTop=0;
	}	
	$(FormAtivo).css("left", mLeft+"px");
	$(FormAtivo).css("top", mTop+"px");
	redimensionar();
    $(FormAtivo).show();		
}

function updateStatus(message, obj){	
    if (isNaN(obj) && obj!=null) {
		updateStatusObj(message,obj);
		return;
	}	
	
	$('#aviso').remove();
	var div=document.createElement("DIV");	
	    div.setAttribute("class","updateStatus");
        div.id = "aviso";  
	document.body.appendChild(div);
		
	if (obj==0){
		$('#aviso').prepend('<img id="theImg" src="./img/trouble.png" width=30 height=30/>');
		navigator.vibrate(1000);		
	}else if (obj==1){
		$('#aviso').prepend('<img id="theImg" src="./img/okay.png" width=30 height=30/>');
    }	

    $("#aviso").append(message);
	var mLeft=(window.innerWidth - $("#aviso").width())/2;
	var mTop=(window.innerHeight - $("#aviso").height())/2; 
	$("#aviso").css("left", mLeft+"px");
	$("#aviso").css("top", mTop+"px");	
	$("#aviso").show();	
	setTimeout(function(){
		$("#aviso").hide(1000)
		$("#aviso").empty();
	},4000);    	
	
	function updateStatusObj(message,elemento) {
		$(".rolagem").scrollTop(0);
		interna();
		
		function interna() {			
			var seta = document.createElement("DIV");
				seta.id = "seta";  
			document.body.appendChild(seta);
					
			var div=document.createElement("DIV");	
				div.setAttribute("class","updateStatus");				 
				div.setAttribute("style","top:88px; left:60px; width:200px;");				
				div.id = "aviso";  
			document.body.appendChild(div);	
				
			var x=$(elemento).offset();
			
			$(".rolagem").animate({scrollTop: x.top-155},
				function(){
					var x=$(elemento).offset();
					$("#seta").css({ top:$(elemento).height() +  x.top + "px",left:x.left+10 + "px"});
					$("#aviso").css({ top:$(elemento).height() +  x.top+15 + "px",left:x.left + "px",width:$(elemento).width()});
					$("#aviso").html(message);
					$("#seta").show();
					$("#aviso").show();								
					setTimeout(function(){
					   $("#seta").hide(200);	
					   $("#aviso").hide(1000);
					   $("#aviso").empty();
					},4000);	
					return 4000				
				} 		
			)							
		}
	}	
}

function convertMilissegundosParaHora(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

function convertHoraParaMilSegundos(oHoras){
	var arrayHora=oHoras.split(":");
	var hora= parseInt(arrayHora[0]);
	var minuto= parseInt(arrayHora[1]);	
	return (hora * 3600000) + (minuto * 60000);	
}

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
}

Date.prototype.addMinutes = function(minutos){
    this.setMinutes(this.getMinutes()+minutos);
    return this;
}

function clearMem() {
    localStorage.clear(); 
    localStorage.setItem("localizacao", "chrome");	
}

function RemoveQuotationMarks(res){
	res = res.replace(/["]/g, '');
	return res 		
}

function RemoveCaracteresEspeciais(res){
    res = res.replace(/-/g, '');
    res = res.replace(/[{(+)}]/g, '');   
    res = res.replace(/[{ }]/g, '');  
	res = res.replace(/["]/g, '');
	return res 		
}

function ArredondaHora(DtHr,fator,arredondarParaMaior){
	var coeff = 1000 * 60 * fator;
	if (arredondarParaMaior) {
		var ParaMaior = coeff;
	} else {
		var ParaMaior = 0;
	}
	return new Date(Math.round((DtHr.getTime()+ParaMaior) / coeff) * coeff)	
}

function LimparMenu(novo) {
	var divPai=document.createElement("div");
	divPai.setAttribute("style","color:white;position:absolute;margin:auto;top:150px;left:0;right:0;bottom:0;width:240px;height:130px");			
	
	var img=document.createElement("img");
	img.setAttribute("src","./img/book135.png");
	img.setAttribute("style","position: absolute;margin:auto;top:-100px;left:0;right:0;width:80px;height:80px");	
	img.setAttribute("class","Novo"+novo);

	var divFilho=document.createElement("div");
	divFilho.setAttribute("class","agendaVazia") 
	divFilho.setAttribute("align","center");
	if (novo == "Agenda"){
		divFilho.innerHTML="Para um novo Agendamento é so apertar na imagem acíma ou no canto direito.Experimente!"; 
	}else{
		divFilho.innerHTML="Para um novo "+novo+" é so apertar na imagem acíma ou no canto direito.Experimente!"; 

	}
	divPai.appendChild(img);
	divPai.appendChild(divFilho);
	document.getElementById("itemData"+novo).appendChild(divPai);
	
	$(".Novo"+novo).click(function(){
		if (novo == "Agenda"){
			CarregarFormAgenda(0);
		
	}else if (novo == "Especialidade"){
			OpenFormEspecialidade(0);
		
	}else if (novo =="Funcionario"){
			OpenFormFuncionario(0);
		
	}else if(novo =="Cliente"){
			carregaFormCliente(0);
	}})
}

function removerAcentos( newStringComAcento ) {
  var string = newStringComAcento;
	var mapaAcentosHex 	= {
		a : /[\xE0-\xE6]/g,
		e : /[\xE8-\xEB]/g,
		i : /[\xEC-\xEF]/g,
		o : /[\xF2-\xF6]/g,
		u : /[\xF9-\xFC]/g,
		c : /\xE7/g,
		n : /\xF1/g
	};

	for ( var letra in mapaAcentosHex ) {
		var expressaoRegular = mapaAcentosHex[letra];
		string = string.replace( expressaoRegular, letra );
	}

	return string;
}

function dicas() {	

    return; 
	
	var flag1 = $.Deferred();
	var flag2 = $.Deferred();
	var flag3 = $.Deferred();
	var flag4 = $.Deferred();
	var flag5 = $.Deferred();
	var flag6 = $.Deferred();
	var flag7 = $.Deferred();
		
	var I0=setInterval(function(){ 
		if (!$("#FormAgenda").is(":visible")){
			clearInterval(I0)
			return; 
		}
		$(".rolagem").scrollTop(0)
		updateStatus("Como você está iniciando, que tal uma ajudazinha?",1);
		flag1.resolve();
		clearInterval(I0)
	},1000);		
			
	$.when(flag1).done(function(){		
		var I1=setInterval(function(){ 
			if (!$("#FormAgenda").is(":visible")){
				clearInterval(I1)
				return; 
			}
			updateStatus("Envie uma foto. Assim quando você chegar,já teremos ideias legais para valorizar seu estilo!","#fieldsetCliente")	
			flag2.resolve();
			clearInterval(I1);
		},6000)		
	});
	
	$.when(flag2).done(function(){
		var I2=setInterval(function(){ 
			if (!$("#FormAgenda").is(":visible")){
				clearInterval(I2)
				return; 
			}
			updateStatus("Você pode escolher os serviços que deseja, simplesmente arrastando-o com o dedo para o espaço serviço","#fieldsetEspecialidade")	
			flag3.resolve();
			clearInterval(I2);
			horizontal("#fieldsetEspecialidade", "./img/choose.png");
		},6000)		
	});
		
	$.when(flag3).done(function(){
		var I3=setInterval(function(){ 
			if (!$("#FormAgenda").is(":visible")){
				clearInterval(I3)
				return; 
			}		
			updateStatus("Aqui você escolhe o dia que do seu agendamento,é só rolar o mostrador!","#fieldsetDia")				
			flag4.resolve();
			clearInterval(I3)
			vertical("#fieldsetDia");
		},6000)		
	});
	
	$.when(flag4).done(function(){
		var I4=setInterval(function(){ 
			if (!$("#FormAgenda").is(":visible")){
				clearInterval(I4)
				return; 
			}
			updateStatus("Hora do agendamento,é só rolar, igual o mostrador de dia!","#PeriodoAgenda")	
			flag5.resolve();
			clearInterval(I4);
			vertical("#PeriodoAgenda");
		},6000)		
	});	
				
	$.when(flag5).done(function(){	
		var I5=setInterval(function(){ 
			if (!$("#FormAgenda").is(":visible")){
				clearInterval(I5)
				return; 
			}		
			updateStatus("Aqui aparecera uma lista de profissionais,variando, dependendo das opções anteriores","#fieldsetFuncionario");	
			flag6.resolve();
			clearInterval(I5);
			horizontal("#fieldsetFuncionario", "./img/Mona.jpg");
		},6000)
	});
	
	$.when(flag6).done(function(){
		if (!$("#FormAgenda").is(":visible")){
			clearInterval(I7)
			return; 
		}		
		var I7=setInterval(function(){ 
			updateStatus("Você encontrará maiores detalhes de cada serviço escolhido junto com os preços unitários e o total do seu agendamento.","#fieldsetDetalhesAgenda");
			flag7.resolve();
			clearInterval(I7)
		},6000)		
	});	
	
	$.when(flag7).done(function(){
		if (!$("#FormAgenda").is(":visible")){
			clearInterval(I8)
			return; 
		}		
		var I8=setInterval(function(){ 
			$(".rolagem").animate({scrollTop: 0},1000);
			updateStatus("Facil, né? Mas em caso de duvidas,fique a vontade para entrar em contato. Obrigado!",1)	
			$("#FormAgenda .imgUndo").on('click', function(){ 
				LimparEdicao("#FormAgenda")					
			})					
			clearInterval(I8)
		},6000)			
	})	
	
	function horizontal(fieldset, imagem) {		    
		var div = document.createElement("div");
		document.getElementById(fieldset.substr(1,fieldset.length)).appendChild(div);		
		var Img=document.createElement("img");
		Img.setAttribute("src",imagem);
		Img.setAttribute("style","z-index:10;position:absolute;width:80px;height:80px;top:0px;right:0;");
		div.appendChild(Img);		
		
		var vetorCol = [];	
		var fator = $(fieldset).width() * .6;
		for (var i=0;i<= fator;i+=2){
			vetorCol.push(i)
		}	
		for (var i=fator;i>0;i-=2){
			vetorCol.push(i)
		}
		var alt = Math.round($(fieldset).height() * .5); 		
		var cont = 0;		
		var nt=setInterval(function(){
			var pos = $(fieldset).offset();				
			div.setAttribute("style","top:" + pos.top  + "px;left:" + pos.left + "px;z-index:10;position:absolute;width:"+ $(fieldset).width() + "px;height:"+$(fieldset).height() + "px;");						
			$(Img).css({top:alt+"px",right:vetorCol[cont]+"px"}); 
			if (cont == vetorCol.length){
			    $(fieldset).find(div).remove();
				clearInterval(nt)
			}
			cont += 1 ;
		},5)				
	}		

	function vertical(fieldset) {		    
		var div = document.createElement("div");
		document.getElementById(fieldset.substr(1,fieldset.length)).appendChild(div);		
		var Img=document.createElement("img");
		Img.setAttribute("src","./img/finger.png");
		Img.setAttribute("style","z-index:10;position:absolute;width:80px;height:50px;top:0px;right:0;");
		div.appendChild(Img);		
		
		var vetorLin = [];	
		var fator = $(fieldset).height()*.8;
		for (var i=30;i<= fator;i+=2){
			vetorLin.push(i)
		}	
		for (var i=fator;i>30;i-=2){
			vetorLin.push(i)
		}
				
		var cont = 0;		
		var nt=setInterval(function(){
			var pos = $(fieldset).offset();				
			div.setAttribute("style","top:" + pos.top  + "px;left:" + pos.left + "px;z-index:10;position:absolute;width:" +  $(fieldset).width() + "px;height:"+$(fieldset).height() + "px;");			
			var col = 10 ;   
			$(Img).css({top:vetorLin[cont]+"px",left:col+"px"}); 
			if (cont == vetorLin.length){
			    $(fieldset).find(div).remove();
				clearInterval(nt)
			}
			cont += 1 ;
		},5)				
	}	
} 

function getMax(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
        if (!max || parseInt(arr[i][prop]) > parseInt(max[prop]))
            max = arr[i];
    }
    return max;
}

function setFloat(el) {
    if (el == null) return 0;
    if (el.length == 0) return 0;
    if (isNaN(el)) {
        var retorno = parseFloat(el.replace(/,/g, "."));
    } else {
        var retorno = parseFloat(el);
    }
    return retorno;
}

function timestrToSec(timestr) {
  var parts = timestr.split(":");
  return (parts[0] * 3600) +
         (parts[1] * 60) +
         (+parts[2]);
}

function pad(num) {
  if(num < 10) {
    return "0" + num;
  } else {
    return "" + num;
  }
}


/*
	Funções para soma de horas com minutos , retirado do stackoverflow 
	
		Exemplo de uso:
		
		time1 = "02:32:12";
        time2 = "12:42:12";
        
		formatTime(timestrToSec(time1) + timestrToSec(time2));	
		
		Que ira retornar:  "15:14:24"

*/

function formatTime(seconds) {
  return [pad(Math.floor(seconds/3600)),
          pad(Math.floor(seconds/60)%60),
          pad(seconds%60),
          ].join(":");
}

function formatDataToANSI(diaHora) {
	return `${diaHora.getFullYear()}-${(diaHora.getMonth()+1).toString().padStart(2,"0")}-${diaHora.getDate().toString().padStart(2,"0")} ${diaHora.getHours().toString().padStart(2,"0")}:${diaHora.getMinutes().toString().padStart(2,"0")}:${diaHora.getSeconds().toString().padStart(2,"0")}`;
}  

function setReal( num ){
	if (num == null) return "0,00";   
	return parseFloat(num).toFixed(2).replace(".", ",")   
}

String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.replace(new RegExp(search, 'g'), replacement);
}

