module.exports = function (chabot) {

   // WebHook で受けたデータをセット
    var payload = chabot.data;
    
    // マージリクエストのクローズは受け取らない
    if (typeof payload.object_kind !== 'undefined') {
    	if (payload.object_kind == 'merge_request' && payload.object_attributes.state != 'opened') {
    		return;
    	}
    }
 
    // ChatWork API の endpoint をセット
    var endpoint = '/rooms/' + chabot.roomid + '/messages';
    // templats/ 内のメッセージテンプレートを読み込む
    var template = chabot.readTemplate('gitlab_push.ejs');
    // WebHook で受けたデータでメッセージテンプレートを描画
    var message_body = chabot.render(template, payload);
    

    // ChatWork API でメッセージ送信
    chabot.client
        .post(endpoint, {
            body: message_body
        })
        .done(function (res) {
            chabot.log('done');
        })
        .fail(function (err) {
            chabot.error(err);
        });
};
