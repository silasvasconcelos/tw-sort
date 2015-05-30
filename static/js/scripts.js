
$(document).ready(function(){/* jQuery toggle layout */

	$('#sort-num').keyup(function(){

		if ($(this).val() > window.data_twitters.length) {
			$('#sort').attr('disabled',true);
			if ($('#alert-qt').length<=0) {
				$('.alert-here').append('<li id="alert-qt"><span class="text-danger">A quantidade não pode ser maior que o resultado da busca!</span></li>');
			};
		} else {
			$('#alert-qt').slideUp('slow').remove();
			$('#sort').attr('disabled',false);
		};
	});

	$('#sort').click(function(event) {

		$('#row-content-sort').html('');
		var tws_sorteds = get_ramdom($('#sort-num').val(), window.data_twitters);
		$.each( tws_sorteds , function(index, val) {
			
			if (window.data_twitters.length>=1) {
				var text = val['text'];
				var profile_image_url = val['profile_image_url'];
				var name = val['name'];
				var screen_name = val['screen_name'];
				var location = val['location'];
					if (location.length>0) {
						location = '<small> - '+location+'</small>';
					};
		
				$('#row-content-sort').append('<div class="col-md-4 col-sm-6 '+screen_name+'" style="display:none;"><div class="panel panel-default"><div class="panel-body"><div class="well well-sm"><div class="media"><a class="thumbnail pull-left" href="http://twitter.com/'+screen_name+'" target="_blank"><img class="media-object img-profile" src="'+profile_image_url+'"></a><div class="media-body"><a href="http://twitter.com/'+screen_name+'" target="_blank"><h4 class="media-heading">'+name+location+'</h4></a><a href="javascript:void(0);" class="show-tw btn btn-sm btn-primary" data-num='+index+'><span class="fa fa-comment"></span> Mensage</a><a href="https://twitter.com/'+screen_name+'/followers" target="_blank" class="btn btn-sm btn-default"><span class="fa fa-heart"></span> Seguidores</a></div></div></div></div></div></div>');
				$('#row-content-sort').find('.'+screen_name).css({'display':'block'}).addClass('animated flipInX');
				$('#row-content').find('.'+screen_name).addClass('animated flipOutX').animate({"width":0,"height":0,}, 1000, function(){ $(this).remove(); });
			
			} else {
				$('#sort').attr('disabled',true);
				$('#sort-num').val('');
			};

		});

	});


	$(document).on("click", '.show-tw', function() {
		var twitter = window.data_twitters_cp[$(this).data('num')];
		console.log( twitter );
		show_alert(twitter.name,twitter.text);
	});

	$('#search-tw-btn').click(function(){
		var time_used = new Date().getTime();
		var search = $('#search-tw').val();

		if (search.length>0) {

			$('#row-content').html('');
			$('#row-content').html('<div class="panel panel-default" id="header-results"><div class="panel-body"><h2> Pesquisando por: '+search+' </h2><h4 id="time"> <p> <samll>Isso pode demorar de segundos a minutos, depende da quantidade de resultados encontrados!</samll> </p> <div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><span class="sr-only"></span></div></div> </h4></div></div>');

			$.ajax({
				url: window.location.origin+"/get-twitters",
				type: 'GET',
				data: {hashtags: search},
			})
			.done(function( data ) {

				data = JSON.parse(data)
				console.log( data.length>=2 );
				if (data.length>=2) {
					$('#painel-sort').animate({'margin-top':0},1000);
				};

				// Global User
				window.data_twitters = data;
				window.data_twitters_cp = data;

				time_used = new Date().getTime() - time_used;
				segundos = parseInt(( time_used / 1000 ) % 60);
				minutos  = parseInt(( time_used / 60000 ) % 60); 

				if (minutos==1) {
					minutos = minutos+' minuto '
				} else if(minutos>=2){
					minutos = minutos+' minutos '
				} else {
					minutos = ''
				};

				if (segundos==1) {
					segundos = segundos+' segundo '
				} else if (segundos>=2) {
					segundos = segundos+' segundos '
				} else {
					segundos = ''
				};

				if (minutos == '' && segundos == '') {
					minutos = 'menos de um segundo!'
				};

				$('#header-results').addClass('animated bounceOutUp');
				$('#row-content').addClass('animated bounce');

				setTimeout(function(){
					$('#time').html('');
					$('#time').html('Tempo: '+minutos+segundos+', Resultados: '+data.length);
					$('#header-results').removeClass('bounceOutUp').addClass('bounceInDown');
				},1000);

				setTimeout(function(){
					$.each(data, function(index, val) {
						var text = val['text'];
						var profile_image_url = val['profile_image_url'];
						var name = val['name'];
						var screen_name = val['screen_name'];
						var location = val['location'];
							if (location.length>0) {
								location = '<small> - '+location+'</small>';
							};

						$('#row-content').append('<div class="col-md-4 col-sm-6 '+screen_name+'" style="display:none;"><div class="panel panel-default"><div class="panel-body"><div class="well well-sm"><div class="media"><a class="thumbnail pull-left" href="http://twitter.com/'+screen_name+'" target="_blank"><img class="media-object img-profile" src="'+profile_image_url+'"></a><div class="media-body"><a href="http://twitter.com/'+screen_name+'" target="_blank"><h4 class="media-heading">'+name+location+'</h4></a><a href="javascript:void(0);" class="show-tw btn btn-sm btn-primary" data-num='+index+'><span class="fa fa-comment"></span> Mensage</a><a href="https://twitter.com/'+screen_name+'/followers" target="_blank" class="btn btn-sm btn-default"><span class="fa fa-heart"></span> Seguidores</a></div></div></div></div></div></div>');
						$('#row-content').find('.'+screen_name).css({'display':'block'}).addClass('animated flipInX');

					});
				}, 1500);


			})
			.fail(function() {
				show_alert('Deu algo errado!','Desculpa, houve algum erro na comunição com o servidor!');
				window.location.href = window.location.href
			});
	
		} else {
			show_alert('Faltou algo!','Você não disse qual a #hashtag para busca!');
		};

	});
	
});

function show_alert(title, content) {
	$('#modal-title').html(title);
	$('#modal-content').html(content);
	$('#modal-content').linkify({
		tagName: 'a',
		target: '_blank',
		newLine: '\n',
		linkClass: null,
		linkAttributes: null
	});
	$('#modal-alerts').modal('show');
}



function get_ramdom(num,ar){
	to_return = []
	while ( num>0 ) {
		if (num>ar.length) {
			num = ar.length
		};
			ramdom_index = Math.floor((Math.random()*ar.length));
			to_return.push(ar[ramdom_index]);
			ar.splice(ramdom_index,1);
		num--;
	};
	return to_return;
}

$('#about').click(function() {
	show_alert('O TW Sort', '<p>O TW Sort é para quem quer fazer sorteios com referencia a postagens dos usuários do Twitter, sendo possível pesquisar por #hashtags, @usuários e muito mais!</p> <p><br><br><img src="https://scontent-gru1-1.xx.fbcdn.net/hphotos-prn2/v/t1.0-9/555876_389620221072155_1673868966_n.jpg?oh=7d653112d08042e6d74cc0f59463dc24&oe=56015980" style="width:100px;"></p> <p>Desenvolvedor: <a href="http://silasvasconcelos.com.br" target="_blank">Silas Vasconcelos</a></p>');
});



