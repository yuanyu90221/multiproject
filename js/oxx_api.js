var GameAPI = {
  //var socket = io.connect('http://127.0.0.1:8000');
  'newPlayer' : function(p_name, p_pic, clientChange, showTiles, readyToStart){//後面兩個是callback
    socket.emit('client', p_name, p_pic);

    socket.on('client_change', function(p_name, user_guid, tv_guid, g_data, sum) {//顯示登入後畫面
      clientChange(p_name, user_guid, tv_guid, g_data, sum);
    });

    socket.on('decide', function() { //決定要不要開始遊戲
      readyToStart();
    });

    socket.on('show_tiles', function(all_tile, player, p_start, name, players, flip_select_number) {//遊戲開始
      showTiles(all_tile, player, p_start, name, players, flip_select_number);
    });
  },

  'tile_click': function(t_id, i_d, t_text, player){
    socket.emit('tile_click', t_id, i_d, t_text, player);

  },

  'waitOthers': function (u_guid, u_name, p_pic, show_tiles){
    socket.emit('wait_other', u_guid, u_name, p_pic);
    socket.on('show_tiles', function(all_tile, player, p_start, name, players, flip_select_number) {//遊戲開始
      show_tiles(all_tile, player, p_start, name, players, flip_select_number);
    });
  },

  'gameStart':function(u_guid, u_name, p_pic, num){
    socket.emit('g_start', u_guid, u_name, p_pic, num);
  }

};
