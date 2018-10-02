$(function() {
    $('.headerTopRight').on('mouseenter', 'button', function(e) {
        $(e.target).css('background', '#fff');
    })
    
    // 移到相应按钮显示隐藏列表
    Myhover($('.btnMyBang'), $('.btnMyBangIfo'));
    Myhover($('.myLogin'), $('.myLoginIfo'));
    Myhover($('.btnMyApp'), $('.myAppIfo'));

    // 点击登陆按钮
    $('.login').click(function(){
        location = '../html/login.html';
    })
    // 点击注册按钮
    $('.register').click(function(){
        location = '../html/register.html';
    })

    // 点击购物袋按钮
    $('.shoppingPag').click(function(){
        location = '../html/carList.html';
    })
    // 更新购物车数量
    $.ajax({
        type: 'get',
        async: true,
        url: '../api/goodsCar.php',
        success: function(data){
            $('.shoppingPagNum').text(JSON.parse(data).length);
        }
    })

    // 置顶
    window.onscroll = function(e){
        if(window.scrollY > 200){
            $('.toTop').css({display:'block'});
        }else{
            $('.toTop').css({display:'none'});
        }
    }
    $('.toTop').click(function(){
        let timer = setInterval(()=>{
                    // 计算缓冲速度（差值越大速度越大）
                    let speed = window.scrollY/10;

                    scrollBy(0,-speed);

                    if(window.scrollY <= 0){
                        clearInterval(timer);

                        // 重置目标值
                        scrollTo(0,0);
                    }
                },30);
    })

    function Myhover(parentEle,ele){
    	parentEle.hover(function() {
        	ele.css('display', 'block');

	    }, function() {
	        ele.css('display', 'none');
	    })
    }

})