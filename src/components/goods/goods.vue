<template>
    <div>
        <div class="goods">
            <div class="menu_wrapper" ref="menuWrapper">
                <ul>
                    <li v-for="(item,index) in goods" class="menu_item" ref="menuList"
                        :class="{'current':currentIndex===index}"
                        @click="selectMenu(index,$event)">
                    <span class="text border-1px">
                        <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
                    </span>
                    </li>
                </ul>
            </div>
            <div class="foods_wrapper" ref="foodsWrapper">
                <ul>
                    <li v-for="item in goods" ref="foodList">
                        <h1 class="title">{{item.name}}</h1>
                        <ul>
                            <li v-for="food in item.foods" @click="selectFood(food,$event)"
                                class="food_item border-1px">
                                <div class="icon"><img width="57" height="57" :src="food.icon"></div>
                                <div class="content">
                                    <h2 class="name">{{food.name}}</h2>
                                    <p class="desc">{{food.description}}</p>
                                    <div class="extra">
                                        <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                                    </div>
                                    <div class="price">
                                        <span class="now">￥{{food.price}}</span><span class="old"
                                                                                      v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                    </div>
                                    <div class="cartcontrol-wrapper">
                                        <cartcontrol @add="addFood" :food="food"></cartcontrol>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <shopcart ref="shopcart" :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice"
                      :min-price="seller.minPrice"></shopcart>
        </div>
        <food @add="addFood" :food="selectedFood" ref="food"></food>
    </div>
</template>

<script>
    import axios from 'axios';
    import BScroll from 'better-scroll';
    import shopcart from '@/components/shopcart/shopcart';
    import cartcontrol from '@/components/cartcontrol/cartcontrol';
    import food from '@/components/food/food';

    const ERR_OK = 0;

    export default {
        props: {
            seller: {
                type: Object
            }
        },
        components: {
            shopcart, cartcontrol, food
        },
        data() {
            return {
                goods: [],
                classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
                listHeight: [],
                scrollY: 0,
                selectedFood: {}
            };
        },
        created() {
            this.$nextTick(function () {
                axios.get('/api/goods').then((response) => {
                    if (response.data.errno === ERR_OK) {
                        this.goods = response.data.data;
                        this.$nextTick(() => {
                            this._initScroll();
                            this._calcuateHeight();
                        });
                    }
                });
            });
        },
        computed: {
            currentIndex() {
                for (let i = 0; i < this.listHeight.length; i++) {
                    let height1 = this.listHeight[i];
                    let height2 = this.listHeight[i + 1];
                    if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                        this.menuScroll.scrollToElement(this.$refs.menuList[i], 200, 0, 0, 'linear');
                        return i;
                    }
                }
                return 0;
            },
            selectFoods() {
                let foods = [];
                this.goods.forEach((good) => {
                    good.foods.forEach((food) => {
                        if (food.count) {
                            foods.push(food);
                        }
                    });
                });
                return foods;
            }
        },
        methods: {
            _initScroll() {
                this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                    click: true
                });
                this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                    click: true,
                    probeType: 3
                });

                this.foodsScroll.on('scroll', (pos) => {
                    this.scrollY = Math.abs(Math.round(pos.y));
                });
            },
            _calcuateHeight() {
                let foodList = this.$refs.foodList;
                let height = 0;
                this.listHeight.push(height);
                for (let i = 0; i < foodList.length; i++) {
                    height += foodList[i].clientHeight;
                    this.listHeight.push(height);
                }
            },
            selectMenu(index, event) {
                if (!event._constructed) {
                    return;
                }
                let foodList = this.$refs.foodList;
                let el = foodList[index];
                this.foodsScroll.scrollToElement(el, 300);
            },
            selectFood(food, event) {
                if (!event._constructed) {
                    return;
                }
                this.selectedFood = food;
                this.$refs.food.show();
            },
            addFood(target) {
                this._drop(target);
            },
            _drop(target) {
                // 体验优化,异步执行下落动画
                this.$nextTick(() => {
                    this.$refs.shopcart.drop(target);
                });
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import "../../common/stylus/mixin";

    .goods
        display: flex
        position: absolute
        overflow: hidden
        top: 174px
        bottom: 46px
        width: 100%
        .menu_wrapper
            flex: 0 0 80px
            width: 80px
            background: #F3F5F7
            .menu_item
                display: table
                height: 54px
                width: 56px
                line-height: 14px
                padding: 0 12px
                &.current
                    position: relative
                    z-index: 10
                    margin-top: -1
                    background: #ffffff
                    font-weight: 700
                    .text
                        border-none()
                .icon
                    display: inline-block
                    vertical-align: top
                    width: 12px
                    height: 12px
                    margin-right: 2px
                    background-size: 12px 12px
                    background-repeat: no-repeat
                    &.decrease
                        bg-image('decrease_3')
                    &.discount
                        bg-image('discount_3')
                    &.guarantee
                        bg-image('guarantee_3')
                    &.invoice
                        bg-image('invoice_3')
                    &.special
                        bg-image('special_3')
                .text
                    display: table-cell
                    width: 56
                    vertical-align: middle
                    line-height: 12px
                    border-1px(7, 17, 27, 0.1);
                    font-size: 12px
        .foods_wrapper
            flex: 1
            .title
                padding-left: 14px
                height: 26px
                font-size: 12px
                line-height: 26px
                border-left: 2px solid #D9DDE1
                color: rgb(147, 153, 159)
                background: #F3F5F7
            .food_item
                display: flex
                margin: 18px
                padding-bottom: 18px
                border-1px(7, 17, 27, 0.1);
                &:last-child
                    border-none()
                    margin-bottom: 0
                .icon
                    flex: 0 0 57px
                    margin-right: 10px
                .content
                    flex: 1
                    .name
                        margin: 2px 0 8px 0
                        font-size: 14px
                        line-height: 14px
                        color: rgb(7, 17, 27)
                    .desc, .extra
                        line-height: 10px
                        font-size: 10px
                        color: rgb(147, 153, 159)
                    .desc
                        margin-bottom: 8px
                        line-height: 12px
                    .extra
                        .count
                            margin-right: 12px
                    .price
                        font-weight: 700
                        line-height: 24px
                        .now
                            margin-right: 8px
                            font-size: 14px
                            line-height: 14px
                            color: rgb(240, 20, 20)
                        .old
                            text-decoration: line-through
                            font-size: 14px
                            color: rgb(147, 153, 159)
                    .cartcontrol-wrapper
                        position: absolute
                        right: 0
                        bottom: 12px
</style>
