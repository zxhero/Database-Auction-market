$(function() {
    var goodslist = [];
    $.ajax({
        type: 'post',
        async: true,
        url: '../api/goodsCar.php',
        success: function(data) {
            JSON.parse(data).map(function(item) {
                goodslist.unshift(item);
                return creatCar(goodslist[0]);
            });


            // 初始化样式
            $('.order_content').on('click', 'a', function() {
                $(this).css('text-decoration', 'none');
            });
            $('.order_lists').css({
                'margin': 0,
                "padding-top": "10px"
            });
            // 浏览历史 渲染页面
            $.ajax({
                type: 'get',
                async: true,
                url: '../api/showHistory_render.php',
                success: function(data) {
                    var goodsHislist = JSON.parse(data);
                    goodsHislist.map(function(item, idex) {
                        var li = document.createElement('li');
                        $(li).attr('data-idx', idex);
                        var img = document.createElement('img');
                        img.src = '../' + item.url;
                        $(img).css({
                            width: '228px',
                            height: '228px',
                            padding: '10px'
                        });
                        var $p = $(`<p><a href="#">${item.title}</a></p><p>￥ ${item.currentPrice} <del>￥ ${item.originPrice}</del><span class="addCar fr">加入购物袋</span></p>`);
                        li.appendChild(img);
                        $(li).append($p);
                        $('.carShowGood').append(li);
                    });

                    var index = 1;
                    var pPage = 1;
                    var $carShowGoodBox = $(".carShowGoodBox");
                    var $v_show = $carShowGoodBox.find(".carShowGood");
                    v_width = $carShowGoodBox.width(); //图片展示区外围div的大小 

                    //注：若为整数，前边不能再加var，否则会被提示underfine 
                    p_count = Math.ceil($carShowGoodBox.find("li").size() / 5); //获取此处li的个数
                    $(".leftBtn").click(function() {
                        if (!$v_show.is(":animated")) {
                            if (pPage == index) {
                                pPage = 1;
                            } else {
                                $v_show.animate({left: '+=' +v_width }, "3000");
                                console.log($v_show.css('right'));
                                pPage--;
                            }
                        }
                    });

                    $(".rightBtn").click(function() {
                        if (!$v_show.is(":animated")) {
                            if (pPage == p_count) {
                                pPage = 3;
                            } else {
                                $v_show.animate({ left: '-=' + v_width }, "3000");
                                pPage++;
                            }
                        }
                    });

                }
            })

            function changeTo(num) {
                var goLeft = num * 400;
                $(".imgList").animate({ left: "-" + goLeft + "px" }, 500);
            }
            //全局的checkbox选中和未选中的样式
            var $allCheckbox = $('input[type="checkbox"]'), //全局的全部checkbox
                $wholeChexbox = $('.whole_check'),
                $wholeChexbox2 = $('.whole_check2'),
                $cartBox = $('.cartBox'), //每个商铺盒子
                $shopCheckbox = $('.shopChoice'), //每个商铺的checkbox
                $sonCheckBox = $('.son_check'); //每个商铺下的商品的checkbox
            $allCheckbox.click(function() {
                if ($(this).is(':checked')) {
                    $(this).next('label').addClass('mark');
                } else {
                    $(this).next('label').removeClass('mark')
                }
            });


            //===============================================全局全选与单个商品的关系================================
            $wholeChexbox.click(function() {
                var $checkboxs = $cartBox.find('input[type="checkbox"]');
                $wholeChexbox2.prop('checked',$(this).prop('checked'))
                if ($(this).is(':checked')) {
                    $checkboxs.prop("checked", true);
                    $checkboxs.next('label').addClass('mark');
                } else {
                    $checkboxs.prop("checked", false);
                    $checkboxs.next('label').removeClass('mark');
                }
                totalMoney();
            });
            $wholeChexbox2.click(function() {
                $wholeChexbox.prop('checked',$(this).prop('checked'))
                var $checkboxs = $cartBox.find('input[type="checkbox"]');
                if ($(this).is(':checked')) {
                    $checkboxs.prop("checked", true);
                    $checkboxs.next('label').addClass('mark');
                } else {
                    $checkboxs.prop("checked", false);
                    $checkboxs.next('label').removeClass('mark');
                }
                totalMoney();
            });


            $sonCheckBox.each(function() {
                $(this).click(function() {
                    if ($(this).is(':checked')) {
                        //判断：所有单个商品是否勾选
                        var len = $sonCheckBox.length;
                        var num = 0;
                        $sonCheckBox.each(function() {
                            if ($(this).is(':checked')) {
                                num++;
                            }
                        });
                        if (num == len) {
                            $wholeChexbox.prop("checked", true);
                            $wholeChexbox2.prop("checked", true);
                            $wholeChexbox.next('label').addClass('mark');
                        }
                    } else {
                        //单个商品取消勾选，全局全选取消勾选
                        $wholeChexbox.prop("checked", false);
                        $wholeChexbox2.prop("checked", false);
                        $wholeChexbox.next('label').removeClass('mark');
                    }
                })
            })

            //=======================================每个店铺checkbox与全选checkbox的关系/每个店铺与其下商品样式的变化===================================================

            //店铺有一个未选中，全局全选按钮取消对勾，若店铺全选中，则全局全选按钮打对勾。
            $shopCheckbox.each(function() {
                $(this).click(function() {
                    if ($(this).is(':checked')) {
                        //判断：店铺全选中，则全局全选按钮打对勾。
                        var len = $shopCheckbox.length;
                        var num = 0;
                        $shopCheckbox.each(function() {
                            if ($(this).is(':checked')) {
                                num++;
                            }
                        });
                        if (num == len) {
                            $wholeChexbox.prop("checked", true);
                            $wholeChexbox2.prop("checked", true);
                            $wholeChexbox.next('label').addClass('mark');
                        }

                        //店铺下的checkbox选中状态
                        $(this).parents('.cartBox').find('.son_check').prop("checked", true);
                        $(this).parents('.cartBox').find('.son_check').next('label').addClass('mark');
                    } else {
                        //否则，全局全选按钮取消对勾
                        $wholeChexbox.prop("checked", false);
                        $wholeChexbox2.prop("checked", false);
                        $wholeChexbox.next('label').removeClass('mark');

                        //店铺下的checkbox选中状态
                        $(this).parents('.cartBox').find('.son_check').prop("checked", false);
                        $(this).parents('.cartBox').find('.son_check').next('label').removeClass('mark');
                    }
                    totalMoney();
                });
            });


            //========================================每个店铺checkbox与其下商品的checkbox的关系======================================================

            //店铺$sonChecks有一个未选中，店铺全选按钮取消选中，若全都选中，则全选打对勾
            $cartBox.each(function() {
                var $this = $(this);
                var $sonChecks = $this.find('.son_check');
                $sonChecks.each(function() {
                    $(this).click(function() {
                        if ($(this).is(':checked')) {
                            //判断：如果所有的$sonChecks都选中则店铺全选打对勾！
                            var len = $sonChecks.length;
                            var num = 0;
                            $sonChecks.each(function() {
                                if ($(this).is(':checked')) {
                                    num++;
                                }
                            });
                            if (num == len) {
                                $(this).parents('.cartBox').find('.shopChoice').prop("checked", true);
                                $(this).parents('.cartBox').find('.shopChoice').next('label').addClass('mark');
                            }

                        } else {
                            //否则，店铺全选取消
                            $(this).parents('.cartBox').find('.shopChoice').prop("checked", false);
                            $(this).parents('.cartBox').find('.shopChoice').next('label').removeClass('mark');
                        }
                        totalMoney();
                    });
                });
            });


            //=================================================商品数量==============================================
            var $plus = $('.plus'),
                $reduce = $('.reduce'),
                $all_sum = $('.sum');
            $plus.click(function() {
                var $inputVal = $(this).prev('input'),
                    $count = parseInt($inputVal.val()) + 1,
                    $obj = $(this).parents('.amount_box').find('.reduce'),
                    $priceTotalObj = $(this).parents('.order_lists').find('.sum_price'),
                    $price = $(this).parents('.order_lists').find('.price').html(), //单价
                    $priceTotal = $count * $price.slice(1);
                $inputVal.val($count);
                $priceTotalObj.html('￥' + $priceTotal.toFixed(2));
                if ($inputVal.val() > 1 && $obj.hasClass('reSty')) {
                    $obj.removeClass('reSty');
                }
                totalMoney();
            });

            $reduce.click(function() {
                var $inputVal = $(this).next('input'),
                    $count = parseInt($inputVal.val()) - 1,
                    $priceTotalObj = $(this).parents('.order_lists').find('.sum_price'),
                    $price = $(this).parents('.order_lists').find('.price').html(), //单价
                    $priceTotal = $count * $price.slice(1);
                if ($inputVal.val() > 1) {
                    $inputVal.val($count);
                    $priceTotalObj.html('￥' + $priceTotal.toFixed(2));
                }
                if ($inputVal.val() == 1 && !$(this).hasClass('reSty')) {
                    $(this).addClass('reSty');
                }
                totalMoney();
            });

            $all_sum.keyup(function() {
                var $count = 0,
                    $priceTotalObj = $(this).parents('.order_lists').find('.sum_price'),
                    $price = $(this).parents('.order_lists').find('.price').html(), //单价
                    $priceTotal = 0;
                if ($(this).val() == '') {
                    $(this).val('1');
                }
                $(this).val($(this).val().replace(/\D|^0/g, ''));
                $count = $(this).val();
                $priceTotal = $count * $price.slice(1);
                $(this).attr('value', $count);
                $priceTotalObj.html('￥' + $priceTotal.toFixed(2));
                totalMoney();
            })

            //======================================移除商品========================================

            var $order_lists = null;
            var $order_content = '';
            $('.delBtn').click(function() {
                $order_lists = $(this).parents('.order_lists');
                $order_content = $order_lists.parents('.order_content');
                $('.model_bg').fadeIn(300);
                $('.my_model').fadeIn(300);
                var closeUl = $(this).closest('ul');
                var gdid = closeUl.attr('data-id');

                //确定按钮，移除商品
                $('.dialog-sure').click(function() {
                    $order_lists.remove();
                    if ($order_content.html().trim() == null || $order_content.html().trim().length == 0) {
                        $order_content.parents('.cartBox').remove();
                    }
                    closeM();
                    $sonCheckBox = $('.son_check');
                    totalMoney();

                    // 数据库删除相应商品信息
                    $.ajax({
                        type: 'GET',
                        async: true,
                        url: '../api/shopCarRemove.php',
                        data: `goodId=${gdid}`,
                        success: function(data) {

                        }
                    })
                })
            });

            //关闭模态框
            $('.closeModel').click(function() {
                closeM();
            });
            $('.dialog-close').click(function() {
                closeM();
            });

            function closeM() {
                $('.model_bg').fadeOut(300);
                $('.my_model').fadeOut(300);
            }


            // 删除所有勾选的商品
            $('.delAll').click(function(e) {
                // 阻止浏览器默认样式
                e.preventDefault();
                $order_allLists = $(':checked').closest('.order_lists');
                console.log($order_allLists);
                var del_listLength = $order_allLists.length;
                if (confirm('是否确认删除所有勾选的商品？')) {
                    $order_allLists.remove();

                    // 更新总价
                    $sonCheckBox = $('.son_check');
                    totalMoney();

                    for (var i = 0; i < del_listLength; i++) {
                        var goodid = $order_allLists.eq(i).attr('data-id');
                        // 数据库删除相应商品信息
                        $.ajax({
                            type: 'GET',
                            async: true,
                            url: '../api/shopCarRemove.php',
                            data: `goodId=${goodid}`,
                        });
                    }

                }

            });

            //======================================总计==========================================
            function totalMoney() {
                var total_money = 0;
                var total_count = 0;
                var calBtn = $('.calBtn a');
                $sonCheckBox.each(function() {
                    if ($(this).is(':checked')) {
                        var goods = Number($(this).parents('.order_lists').find('.sum_price').html().substring(1));
                        var num = Number($(this).parents('.order_lists').find('.sum').val());
                        total_money += goods;
                        total_count += num;
                    }
                });
                $('.total_text').html('￥' + total_money.toFixed(2));
                $('.piece_num').html(total_count);

                // console.log(total_money,total_count);

                if (total_money != 0 && total_count != 0) {
                    if (!calBtn.hasClass('btn_sty')) {
                        calBtn.addClass('btn_sty');
                    }
                } else {
                    if (calBtn.hasClass('btn_sty')) {
                        calBtn.removeClass('btn_sty');
                    }
                }
            }

        }
    })


    // 数据生成列表
    function creatCar(obj) {
        var arr_liName = ['list_chk', 'list_con', 'list_info', 'list_price', 'list_amount', 'list_sum', 'list_op'];
        var ul = document.createElement('ul');
        $(ul).addClass('order_lists');
        $(ul).attr('data-id', obj.goodId);
        // 第一个li
        var li1 = document.createElement('li');
        $(li1).addClass(arr_liName[0]);
        $(li1).html(' <input type="checkbox" id="checkbox_2" class="son_check">')

        // 第二个li
        var li2 = document.createElement('li');
        $(li2).addClass(arr_liName[1]);
        $(li2).html(`<div class="list_img"><a href="javascript:;"><img src="../${obj.url}" alt=""></a></div><div class="list_text "><a href="javascript:;">${obj.title}</a></div>`);
        // 第三个li
        var li3 = document.createElement('li');
        $(li3).addClass(arr_liName[2]);
        if (obj.color != '' || obj.size != '') {
            $(li3).html(` <p>规格：颜色大小</p><p>尺寸：${obj.size + obj.color}</p>`);
        } else {
            $(li3).html(` <p>规格：默认</p><p>尺寸：16*16*3(cm) 白色</p>`);
        }


        // 第四个li
        var li4 = document.createElement('li');
        $(li4).addClass(arr_liName[3]);
        $(li4).html(` <p class="price">￥${obj.price}</p>`);

        // 第五个li
        var li5 = document.createElement('li');
        $(li5).addClass(arr_liName[4]);
        $(li5).html(`<div class="amount_box">
                        <a href="javascript:;" class="reduce reSty">-</a>
                        <input type="text" value="${obj.qty}" class="sum">
                        <a href="javascript:;" class="plus">+</a>
                    </div>`);
        // 第六个li
        var li6 = document.createElement('li');
        $(li6).addClass(arr_liName[5]);
        $(li6).html(`<p class="sum_price">￥${(obj.price*obj.qty).toFixed(2)}</p>`);
        // 第七个li
        var li7 = document.createElement('li');
        $(li7).addClass(arr_liName[6]);
        $(li7).html(` <p class="del"><a href="javascript:;" class="delBtn">移除商品</a></p>`);

        $(ul).append(li1);
        $(ul).append(li2);
        $(ul).append(li3);
        $(ul).append(li4);
        $(ul).append(li5);
        $(ul).append(li6);
        $(ul).append(li7);
        $('.order_content').append(ul);
    }


})