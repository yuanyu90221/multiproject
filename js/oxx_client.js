var func = {};
var p_name = '';
var p_pic = '';
//Server interactive
$(function() {
  console.log(typeof newPlayer);
  console.log(newPlayer);
  var game_guid = ''; //存遊戲的guid
  var c_infro = '';
  var u_guid = ''; //這個人的guid
  var u_name = ''; //這個人的名字
  var inning = ''; //新的一局的uuid
  var allthe_guid = ''; //所有遊戲的名字
//socket.emit('client', p_name, p_pic);
  //一開始就於html設定 display:none
  $('#decide').hide();
  $('#cant_play').hide();
  $('#again').hide();
  $('#score').hide();
  $('#make_sure').hide();

//為了要自動觸發新增玩家事件
  $('#yes_me').click(function() {
    newPlayer(p_name, p_pic,
      function(p_name, user_guid, tv_guid, g_data, sum){
        console.log('clientChange')
        u_guid = user_guid;
        u_name = p_name;
        $('div').remove('.p');
        $('#make_sure').hide();
      },
      function(all_tile, player, p_start, name, players, flip_select_number){
          $("#memory_board").empty();
          $('#again').hide();
          for (var j = 0; j < players.length; j++) {
            if (players[j].guid == u_guid) {
              $('#memory_board').append('<span class="color-box" style="background-color:' + players[j].color + ' "></span>');
            }
          }
          tiles = [];
          flip_kind = flip_select_number;
          if (flip_select_number == 1) {
            for (var i = 0; i < all_tile.length; i++) {
              $('div').remove('.f'); //刪除之前的board
              $('div').remove('.s');
              var tile = $('<button/>').addClass('f')
                .attr('id', 'tile_' + i)
                .click(function() {
                  var t_id = $(this).attr('id');
                  var t_text = $(this).attr('text'); //undefind
                  var i_d = t_id.substring(7, 5);
                  socket.emit('tile_click', t_id, i_d, t_text, player);
                  console.log('點擊這個的id:' + t_id);
                });
              tiles.push(tile);
            }
            $('#memory_board').append(tiles);
            $("#memory_board").show();
          }

          if (flip_select_number == 2) {
            for (var i = 0; i < all_tile.length; i++) {
              $('div').remove('.f'); //刪除之前的board
              $('div').remove('.s');
              var tile = $('<button/>').addClass('s')
                .attr('id', 'tile_' + i)
              .click(function() {
                var t_id = $(this).attr('id');
                var t_text = $(this).attr('text'); //undefind
                var i_d = t_id.substring(7, 5);
                socket.emit('tile_click', t_id, i_d, t_text, player);
                console.log('點擊這個的id:' + t_id);
              });
              tiles.push(tile);
            }
            $('#memory_board').append(tiles);
            $("#memory_board").show();
          }
      },
      function(){
        $('#decide').show();
      }

  );

  })

  //接收儲存自己的id & name (不需要其他資訊)
  socket.on('client_change', function(p_name, user_guid, tv_guid, g_data, sum) {
    u_guid = user_guid;
    u_name = p_name;
  });

  $('#start').click(function() {
    socket.emit('g_start'); //遊戲開始
  });

  socket.on('join_failed', function() {
    $('#cant_play').show();
  });

  socket.on('not_enough_p', function() {
    $('#play').empty();
  })


  //遊戲開始
  socket.on('ox_game_start', function(g_infro, start_p) {
    $('#again').hide();
    c_infro = g_infro;
    $('#game_data').hide();

    $('.b').remove();
    var board = $('<table/>').addClass('b')
      .attr('style', 'border: 3px ;background-color: rgb(255, 255, 255);  width:60%; height:60%;	align=center cellpadding=4 cellspacing=4 frame=border rules=all');
    var body = $('<tbody/>').addClass('b');
    var tr0 = $('<tr/>').addClass('b');
    var tr1 = $('<tr/>').addClass('b');
    var tr2 = $('<tr/>').addClass('b');

    for (var i = 0; i < 3; i++) {
      var td = $('<td/>').addClass('b')
        .attr('style', 'width:80px;height:80px; float:left;margin:5px;padding:10px;font-size:60px;text-align:center;')

      var button = $('<button/>').addClass('b')
        .attr('id', i)
        .attr('style', 'width:80px;height:80px; float:left;margin:5px;padding:10px;font-size:60px;text-align:center;background-image: url("../static/question-2.jpg");')
        .click(function() {
          var b_id = $(this).attr('id');
          socket.emit('b_click', b_id, c_infro);
        });
      td.append(button);
      tr0.append(td);
    }

    for (var i = 3; i < 6; i++) {
      var td = $('<td/>').addClass('b')
        .attr('style', 'width:80px;height:80px; float:left;margin:5px;padding:10px;font-size:60px;text-align:center;');

      var button = $('<button/>').addClass('b')
        .attr('id', i)
        .attr('style', 'width:80px;height:80px; float:left;margin:5px;padding:10px;font-size:60px;text-align:center;background-image: url("../static/question-2.jpg");')
        .click(function() {
          var b_id = $(this).attr('id');
          socket.emit('b_click', b_id, c_infro);
        });
      td.append(button);
      tr1.append(td);
    }

    for (var i = 6; i < 9; i++) {
      var td = $('<td/>').addClass('b')
        .attr('style', 'width:80px;height:80px; float:left;margin:5px;padding:10px;font-size:60px;text-align:center;');

      var button = $('<button/>').addClass('b')
        .attr('id', i)
        .attr('style', 'width:80px;height:80px; float:left;margin:5px;padding:10px;font-size:60px;text-align:center;background-image: url("../static/question-2.jpg");')
        .click(function() {
          var b_id = $(this).attr('id');
          socket.emit('b_click', b_id, c_infro);
        });
      td.append(button);
      tr2.append(td);
    }

    body.append(tr0);
    body.append(tr1);
    body.append(tr2);
    board.append(body);
    $('#play').append(board);
  });

/*------------------------------------*/
	//遊戲畫面更新
  socket.on('new_board', function(board) {
    for (var i = 0; i < board.length; i++) {
      if (board[i] != null) {
        $('#' + i).text(board[i]);
        $('#' + i).attr("disabled", true);
        $('#' + i).css({
          'background-image': "url(../static/green-1.jpg)"
        });
      }
    }
  });

  socket.on('winner', function(board, win, all_name, all_guid, key) {
    allthe_guid = all_guid;
    for (var i = 0; i < board.length; i++) {
      $('#' + i).attr("disabled", true);
      $('#' + i).css({
        'background-image': "url(../static/green-1.jpg)"
      });
    }
    setTimeout($('.b').remove(), 100000);
    $('#again').show();
  });

/*------------------------------------*/

  //點遊戲之後的動作
  socket.on('deuce', function(board) {
    for (var i = 0; i < board.length; i++) {
      $('#' + i).attr("disabled", true);
      $('#' + i).css({
        'background-image': "url(../static/green-1.jpg)"
      });
    }
    setTimeout($('.b').remove(), 100000);
    $('#again').show();
    //顯示出可以選擇的遊戲
    //$('#again').append('<input id="'+ csdcd +'" type="button" value="'+ scdsd +'" style="width:100px;height:100px">');
  })

  socket.on('show_score_hide', function() { //那個button不見
    $('#all_score').hide();
  })

  socket.on('g_button', function(win, all_name, all_guid, key) {
    $('#money').empty();
    $('#again').empty();

    //$('.b').remove();
    var board = $('<table/>')
      .attr('style', 'border: 1px ;background-color: rgb(255, 255, 255);  width:100%; height:50%;	align=left cellpadding=1 cellspacing=1 frame=border rules=all');
    var body = $('<tbody/>');
    var tr0 = $('<tr/>');
    var tr1 = $('<tr/>');
    var tr2 = $('<tr/>');
    var tr3 = $('<tr/>');

    for (var i = 0; i < all_name.length; i++) {
      if (i == 0 || i == 1) {
        var td = $('<td/>')
          .attr('style', 'width:300px;height:60px; float:left;margin:1px;font-size:10px;text-align:center;')

        var button = $('<button/>')
          .attr('id', all_name[i])
          .attr('name', all_guid[i])
          .text(all_name[i])
          .val(all_name[i])
          .attr('style', 'width:300px;height:60px; float:left;margin:1px;font-size:30px;text-align:center;')
          .click(function() {

            var name = $(this).val();
            var guid = $(this).attr('name');
            socket.emit('leave_g', key, u_guid, name, guid);
            socket.emit('new_g', key, name, guid); //改變電視畫面
            document.location.href = "?inning=" + key + "&game=" + guid + "?";

            //var b_id = $(this).attr('id');
            //socket.emit('b_click', b_id, c_infro);
          });
        td.append(button);
        tr0.append(td);
      }


      if (i == 2 || i == 3) {
        var td = $('<td/>')
          .attr('style', 'width:300px;height:60px; float:left;margin:1px;font-size:10px;text-align:center;')

        var button = $('<button/>')
          .attr('id', all_name[i])
          .attr('name', all_guid[i])
          .val(all_name[i])
          .text(all_name[i])
          .attr('style', 'width:300px;height:60px; float:left;margin:1px;font-size:30px;text-align:center;')
          .click(function() {

            var name = $(this).val();
            var guid = $(this).attr('name');
            socket.emit('leave_g', key, u_guid, name, guid);
            socket.emit('new_g', key, name, guid); //改變電視畫面
            document.location.href = "?inning=" + key + "&game=" + guid + "?";

            //var b_id = $(this).attr('id');
            //socket.emit('b_click', b_id, c_infro);
          });
        td.append(button);
        tr1.append(td);
      }



      if (i == 4) {
        var td = $('<td/>')
          .attr('style', 'width:300px;height:60px; float:left;margin:1px;font-size:10px;text-align:center;')

        var button = $('<button/>')
          .attr('id', all_name[i])
          .attr('name', all_guid[i])
          .val(all_name[i])
          .text(all_name[i])
          .attr('style', 'width:300px;height:60px; float:left;margin:1px;font-size:30px;text-align:center;')
          .click(function() {

            var name = $(this).val();
            var guid = $(this).attr('name');
            socket.emit('leave_g', key, u_guid, name, guid);
            socket.emit('new_g', key, name, guid); //改變電視畫面
            document.location.href = "?inning=" + key + "&game=" + guid + "?";

            //var b_id = $(this).attr('id');
            //socket.emit('b_click', b_id, c_infro);
          });
        td.append(button);
        tr2.append(td);
      }
    } //for 迴圈


    var td = $('<td/>')
      .attr('style', 'width:300px;height:60px; float:left;margin:2px;font-size:10px;text-align:center;')

    var button = $('<button/>')
      .attr('id', 'exit_button')

    .val('退出遊戲')
      .text('退出遊戲')
      .attr('style', 'width:300px;height:60px; float:left;margin:2px;font-size:30px;text-align:center;')
      .click(function() {
        socket.emit('exit', u_guid); //傳這個人的guid
        document.location.href = "error";
        $('#money').hide();
      });
    td.append(button);
    tr2.append(td);


    var td = $('<td/>')
      .attr('style', 'width:600px;height:60px; float:left;margin:2px;font-size:10px;text-align:center;')

    var button = $('<button/>')
      .attr('id', 'all_score')
      .text('查看大家成績')
      .val('查看大家成績')
      .attr('style', 'width:600px;height:60px; float:left;margin:2px;font-size:30px;text-align:center;')
      .click(function() {
        socket.emit('show_score');
        $(this).hide();
      });
    td.append(button);
    tr3.append(td);

    body.append(tr0);
    body.append(tr1);
    body.append(tr2);
    body.append(tr3);
    board.append(body);
    //$('#play').append(board);
    $('#again').append(board);
    $('#again').show();
  })

  //清除畫面資料
  socket.on('n_clear', function() {
    $('#again').empty();
    $('#play').empty();
  });



  socket.on('do_exit', function() {
    $('#exit').append('你已經成功退出了。請重新加入遊戲或關閉瀏覽器。');
    $('#game_data').hide();
    $('#play').hide();
    $('#again').hide();
    $('#infor').hide();

  });

  socket.on('exit_hide', function() { //隱藏退出的資訊
    $('#again').hide();
  })

  $('#ag_button').click(function() {
    socket.emit('play_again');
  })

  socket.on('clear_screen', function() {
    $('#again').hide();
  });

});
