cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        this.testProtobuf();
    },

    start() {
        cc.log("hihi, test");
    },

    testProtobuf: function () {
        if (cc.sys.isNative) {
            cc.log("jsb.fileUtils=" + jsb.fileUtils);
            jsb.fileUtils.addSearchPath("res/raw-assets/resources", true);
        }

        var filename1 = "test1.proto";

        // 导入为插件，直接使用
        var protobufHere = protobuf;

        // 使用protobuf.js加載test1.proto檔案
        protobufHere.load(filename1, function (err, root) {//Data/PbLobby.proto
            if (err)
                throw err;

            // 將加載成功的資源丟到root，這裡讀到的是一堆protobuf.js的函數
            cc.log("root=" + root);
            for (var i in root) {
                cc.log("root." + i + "=" + root[i]);
            }
            //return;

            cc.log("加载protobuf.js完毕，开始测试protobuf...")

            // 使用lookupEnum捉取test1.proto package裡面的PbLobby的cmd
            var cmd = root.lookupEnum("PbLobby.Cmd");
            // cmd是一個結構體
            cc.log("@@@cmd: ",cmd);
            // 轉成json格式
            cc.log(`cmd = ${JSON.stringify(cmd)}`);
            // 使用其中的常數
            cc.log("CMD_KEEPALIVED_C2S = "+cmd.values.CMD_KEEPALIVED_C2S);

            // lookup 等价于 lookupTypeOrEnum 
            // 不同的是 lookup找不到返回null,lookupTypeOrEnum找不到则是抛出异常
            // 這裡PbLobby.Cmd1會回傳null
            var type1 = root.lookup("PbLobby.Cmd1");
            cc.log("type1 = "+type1);
            var type2 = root.lookup("PbLobby.Test1");
            cc.log("type2 = "+type2);

            // 取得PbLobby.Test1的類型
            var Test1Message = root.lookupType("PbLobby.Test1");
            cc.log("Test1Message = "+Test1Message);

            // 定義一個要傳送的結構體
            //var payload = { id: 1,name:"hello protobuf" };
            var payload = { id: 1,name:"hello protobuf",sex:"男" };
            cc.log(`payload = ${JSON.stringify(payload)}`);

           
            // 过滤掉一些message中的不存在的字段
            var message = Test1Message.create(payload);             
            cc.log(`message = ${JSON.stringify(message)}`);

            // 編碼成protobuf格式
            var buffer = Test1Message.encode(message).finish();
            cc.log("buffer1 = "+buffer);
            cc.log(`buffer2 = ${Array.prototype.toString.call(buffer)}`);

            // 解碼
            var decoded = Test1Message.decode(buffer);
            cc.log("decoded1 = "+decoded);
            cc.log(`decoded2 = ${JSON.stringify(decoded)}`);
        });
    },
});
