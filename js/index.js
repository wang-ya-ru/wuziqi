$(function(){
    var canvas=$('#canvas').get(0);
    var ctx = canvas.getContext('2d');
    var ROW=15;
    var w = canvas.width;
    var off=w/ROW;
    var flag=true;
    var blocks = {};
    var ai=false;
    var blank={};
    var t;
    var t1;
    var c=-1;
    var c1=-1;
    for(var i=0;i<ROW;i++){
        for(var j=0;j<ROW;j++){
            blank[p2k(i,j)]=true;
        }
    }
    function xing(x,y){
        ctx.beginPath();
        ctx.arc(x*off+0.5,y*off+0.5,3,0,2*Math.PI)
        ctx.fill();
        ctx.closePath();
    }

    function draw(){
        ctx.beginPath();
        //0.5
        for (var i=0;i<ROW;i++){
            ctx.moveTo(0.5*off+0.5,(i+0.5)*off+0.5);
            ctx.lineTo((ROW-0.5)*off+0.5,(i+0.5)*off+0.5);
        }
        for (var j=0;j<ROW;j++){
            ctx.moveTo((j+0.5)*off+0.5,0.5*off+0.5);
            ctx.lineTo((j+0.5)*off+0.5,(ROW-0.5)*off+0.5);
        }

        ctx.stroke();
        ctx.closePath();

        xing(3.5,3.5);
        xing(11.5,3.5);
        xing(7.5,7.5);
        xing(3.5,11.5);
        xing(11.5,11.5)
    }
    draw()
    function makeChess(position,color){
        ctx.save();
        ctx.beginPath();
        ctx.translate((position.x+0.5)*off+0.5,(position.y+0.5)*off+0.5)
        ctx.arc(0,0,18,0,2*Math.PI)
        var radgrad = ctx.createRadialGradient(4,4,2,0,0,18);
        radgrad.addColorStop(0, '#fff');
        radgrad.addColorStop(0.9, '#DCDCDC');
        radgrad.addColorStop(1, 'rgba(255,255,188,0)');

        var radgrad1 = ctx.createRadialGradient(5,5,2,0,0,18)
        radgrad1.addColorStop(0, '#fff');
        radgrad1.addColorStop(0.9, '#2B2B2B');
        radgrad1.addColorStop(1, 'rgba(255,255,188,0)');
        if(color==='white'){
            ctx.fillStyle=radgrad;
            clearInterval(t);
            clearInterval(t1);
            c=-1;
            c1=-1;
            makebiao1();
            makebiao();
            // ctx.shadowColor='EC0000';
            // ctx.shadowOffsetX=2;
            // ctx.shadowOffsetY=2;
            // ctx.shadowBlur=0;
        }else if(color==='black'){
            ctx.fillStyle=radgrad1;
            clearInterval(t);
            clearInterval(t1);
            c=-1;
            c1=-1;
            makebiao1();
            makebiao();
            // ctx.shadowColor='EC0000';
            // ctx.shadowOffsetX=2;
            // ctx.shadowOffsetY=2;
            // ctx.shadowBlur=0;
        }
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        blocks[v2k(position)]=color;//记录旗子数据
        delete (blank[v2k(position)]);
        console.log(blocks)
    }
    function v2k(position){
        return position.x+'_'+position.y;
    }//坐标
    function p2k(x,y){
        return x+'_'+y;
    }
    function check(position,color){
        var num=1;//横排
        var shu=1;//竖排
        var zuo=1;//向右斜
        var you=1;//向左斜
        var table={};//单独一种颜色的旗子表
        for(var i in blocks){
            if(blocks[i]===color){
               table[i]=true;
            }
        }
        //横
        var tx=position.x;
        var ty=position.y;
        while(table[p2k(tx+1,ty)]){
            num++;
            tx++;
        }
        tx=position.x;
        ty=position.y;
        while(table[p2k(tx-1,ty)]){
            num++;
            tx--;
        }
        //竖排
        tx=position.x;
        ty=position.y;
        while(table[p2k(tx,(ty+1))]){
            shu++;
            ty++
        }
        tx=position.x;
        ty=position.y;
        while(table[p2k(tx,(ty-1))]){
            shu++;
            ty--;
        }
        //从左向右斜
        tx=position.x;
        ty=position.y;
        while(table[p2k(tx+1,(ty+1))]){
            zuo++;
            tx++
            ty++;
        }
        tx=position.x;
        ty=position.y;
        while(table[p2k(tx-1,(ty-1))]){
            zuo++;
            tx--;
            ty--;
        }
        //从右向左斜
        tx=position.x;
        ty=position.y;
        while(table[p2k(tx-1,(ty+1))]){
            you++;
            tx--;
            ty++;
        }
        tx=position.x;
        ty=position.y;
        while(table[p2k(tx+1,(ty-1))]){
            you++;
            tx++;
            ty--;
        }
        return Math.max(num,shu,zuo,you);
    }
    function k2v(key){
        var arr=key.split('_')
        return {x:parseInt(arr[0]),y:parseInt(arr[1])}
    }
    function drawText(position,text,color){
        ctx.save();
        ctx.font='14px 微软雅黑'
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        if(color==='black'){
            ctx.fillStyle='white';
        }
        if(color==='white'){
            ctx.fillStyle='black';
        }
        ctx.fillText(text,(position.x+0.5)*off,(position.y+0.5)*off)
        // ctx.fill();
        ctx.restore();
    }
    function review(){
        var i=1;
        for( var position in blocks){
            drawText(k2v(position),i,blocks[position]);
            i++;
        }
    }
    //重新开始
    function restart(){
        ctx.clearRect(0,0,w,w);
        draw();
        blocks={};
        blank={};
        for(var i=0;i<ROW;i++){
            for(var j=0;j<ROW;j++){
                blank[p2k(i,j)]=true;
            }
        }
        flag=true;
        $(canvas).off('click').on('click',handleClick);
        $('.review').removeClass('lose');
        $('.qipu').removeClass('sheng');
        clearInterval(t);
        clearInterval(t1);
        c=-1;
        c1=-1;
        makebiao1();
        makebiao();
    }
    function AI(){
        var max1 = -Infinity;
        var max2 = -Infinity;
        var pos1;
        var pos2;
        for (var i in blank){
            var score1 = check(k2v(i),'black');
            var score2 = check(k2v(i),'white');
            if(score1 > max1){
                max1=score1;
                pos1 =k2v(i)
            }
            if(score2 > max2){
                max2=score2;
                pos2 =k2v(i)
            }
        }
        if(max2>max1){
            return pos2;
        }else{
            return pos1;
        }
    }
    $('.re').on('click',restart);

    function qipu(){
        $(canvas).off('click');
        if(confirm('是否生成棋谱')){
            review();
        }
    }
    function back(){
        $(canvas).off('click');
        restart();
    }
    function handleClick(e){
        var position={x:Math.round((e.offsetX-off/2)/off),y:Math.round((e.offsetY-off/2)/off)};
        if(blocks[v2k(position)]){
            return;
        }
        function hei(){
            $('.review').addClass('lose');
            $('.review .winner').text('黑棋赢')
            $('#yes').on('click',function(){
                $('.review').removeClass('lose');
                $('.qipu').addClass('sheng');
                $('.daqipu').text('是否生成棋谱');
                $('#yes1').on('click',function(){
                    $(canvas).off('click');
                    $('.qipu').removeClass('sheng');
                    review();
                });
                $('#no1').on('click',function(){
                    $('.qipu').removeClass('sheng');
                    back();
                });
            });
            $('#no').on('click',function(){
                $('.review').removeClass('lose');
                back();
            });
        }
        function bai(){
            $('.review').addClass('lose');
            $('.review .winner').text('白棋赢')
            $('#yes').on('click',function(){
                $('.review').removeClass('lose');
                $('.qipu').addClass('sheng');
                $('.daqipu').text('是否生成棋谱');
                $('#yes1').on('click',function(){
                    $(canvas).off('click');
                    $('.qipu').removeClass('sheng');
                    review();
                });
                $('#no1').on('click',function(){
                    $('.qipu').removeClass('sheng');
                    back();
                });
            });
            $('#no').on('click',function(){
                $('.review').removeClass('lose');
                back();
            });
        }
        function heishu(){
            $('.shu').addClass('chaoshi');
            $('.shu .transport').text('黑棋输')
            $('#yes2').on('click',function(){
                $('.shu').removeClass('chaoshi');
                back();
                // $('.review').removeClass('lose');
                // $('.qipu').addClass('sheng');
                // $('.daqipu').text('是否生成棋谱');
                // $('#yes1').on('click',function(){
                //     $(canvas).off('click');
                //     $('.qipu').removeClass('sheng');
                //     review();
                // });
                // $('#no1').on('click',function(){
                //     $('.qipu').removeClass('sheng');
                //     back();
                // });
            });
            $('#no2').on('click',function(){
                $('.shu').removeClass('chaoshi');
                return;
            });
        }
        function baishu(){
            $('.shu').addClass('chaoshi');
            $('.shu .transport').text('白棋输')
            $('#yes2').on('click',function(){
                $('.shu').removeClass('chaoshi');
                back();
                // $('.review').removeClass('lose');
                // $('.qipu').addClass('sheng');
                // $('.daqipu').text('是否生成棋谱');
                // $('#yes1').on('click',function(){
                //     $(canvas).off('click');
                //     $('.qipu').removeClass('sheng');
                //     review();
                // });
                // $('#no1').on('click',function(){
                //     $('.qipu').removeClass('sheng');
                //     back();
                // });
            });
            $('#no2').on('click',function(){
                $('.shu').removeClass('chaoshi');
                return;
            });
        }
        if(ai){
            makeChess(position,'black');
            if(check(position,'black')>=5){
                // alert('黑棋赢');
                // alert()
                // winner();
                // $('.review .winner').text('黑棋赢')
                // $(canvas).off('click');
                // if(confirm('是否生成棋谱')){
                //     review();
                // }
                // qipu()
                hei();
                return;
            }
            makeChess(AI(),'white');
            if(check(AI(),'white')>5){
                // alert('白棋赢');
                // winner();
                // $(canvas).off('click');
                // if(confirm('是否生成棋谱')){
                //     review();
                // }
                bai();
                return;
            }
            return;
        }

        if (flag){
            makeChess(position,'black');
            clearInterval(t1);
            t=setInterval(function(){
                makebiao();
                if(c>=60){
                    clearInterval(t);
                    alert('白棋输')
                }
            },1000);
            console.log(c)
            c=-1;
            // t=setInterval(makebiao,1000)
            if(check(position,'black')>=5){
                // alert('黑棋赢');
                // $(canvas).off('click');
                // if(confirm('是否生成棋谱')){
                //     review();
                // }
                hei();
                clearInterval(t1);
                clearInterval(t);
                c=-1;
                c1=-1;
                return;
            }
        }else{
            makeChess(position,'white');
            clearInterval(t);
            t1=setInterval(function() {
                makebiao1();
                if(c1>=60){
                    clearInterval(t1);
                    heishu();
                }
            },1000);
            console.log(c1);
            c1=-1;
            if(check(position,'white')>=5){
                // alert('白棋赢');
                // $(canvas).off('click');
                // if(confirm('是否生成棋谱')){
                //     review();
                // }
                bai();
                clearInterval(t1);
                clearInterval(t);
                c=-1;
                c1=-1;
                return;
            }
        }
        flag = !flag;
        console.log(position)
    }
    $(canvas).on('click',handleClick);
    $('.ai').on('click',function(){
        $(this).parent().find('.ai').toggleClass('.ai').toggleClass('active');
        ai=!ai;
        restart();
    })


    var biao=$('#biao').get(0);
    var bi=biao.getContext('2d');
    function makebiao(){
        bi.clearRect(0,0,110,110)
        bi.save();
        bi.translate(55,55);
        bi.beginPath();
        bi.arc(0,0,50,0,Math.PI*2);
        bi.stroke();
        bi.closePath();
        function miao(){
            bi.moveTo(0,-50)
            bi.lineTo(0,-47)
            bi.stroke()
        }
        for (var s=0;s<60;s++){
            miao();
            if(s%5===0){
                bi.lineTo(0,-45)
            }
            bi.rotate(Math.PI/30)
        }
        bi.save();

        bi.rotate((c+1)*2*Math.PI/60);
        bi.beginPath();
        bi.strokeStyle='red';
        bi.moveTo(0,20);
        bi.lineTo(0,5);
        bi.stroke();
        bi.closePath();
        bi.beginPath();
        bi.moveTo(5,0);
        bi.arc(0,0,5,0,Math.PI*2);
        bi.stroke();
        bi.closePath();
        bi.beginPath();
        bi.moveTo(0,-5);
        bi.lineTo(0,-33)
        bi.stroke();
        bi.closePath();
        bi.restore();
        c++;
        bi.restore();
        return c;

    }
    makebiao()
    var biao1=$('#biao1').get(0);
    var bi1=biao1.getContext('2d');
    function makebiao1(){
        bi1.clearRect(0,0,110,110)
        bi1.save();
        bi1.translate(55,55);
        bi1.beginPath();
        bi1.arc(0,0,50,0,Math.PI*2);
        bi1.stroke();
        bi1.closePath();
        function miao(){
            bi1.moveTo(0,-50)
            bi1.lineTo(0,-47)
            bi1.stroke()
        }
        for (var s=0;s<60;s++){
            miao();
            if(s%5===0){
                bi1.lineTo(0,-45)
            }
            bi1.rotate(Math.PI/30)
        }
        bi1.save();
        bi1.rotate(2*Math.PI*(c1+1)/60);
        bi1.beginPath();
        bi1.strokeStyle='red';
        bi1.moveTo(0,20);
        bi1.lineTo(0,5);
        bi1.stroke();
        bi1.closePath();
        bi1.beginPath();
        bi1.moveTo(5,0);
        bi1.arc(0,0,5,0,Math.PI*2)
        bi1.stroke();
        bi1.closePath();
        bi1.beginPath();
        bi1.moveTo(0,-5);
        bi1.lineTo(0,-33)
        bi1.stroke();
        bi1.closePath();
        bi1.restore();
        c1++;

        bi1.restore();

    }
    makebiao1();
})