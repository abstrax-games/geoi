<script setup lang="ts">
import { axFetch } from '@/services/backend';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const geoiContent = ref('以代码织就文字的诗篇，以逻辑雕琢万物的宏伟。');
const geoiSourceAuthor = ref('');
const geoiSource = ref('句');
const geoiLiked = ref(0);

async function getGeoi() {
    const res = await axFetch.get('/geoi');
    geoiContent.value = res.content;
    geoiSourceAuthor.value = res.source_author;
    geoiSource.value = res.source;
    geoiLiked.value = res.like_count;
}

const timerSetters = [] as number[];
const newTask = (fn: Function, time: number) => {
    const timer = setInterval(fn, time)
    timerSetters.push(timer)
}

onMounted(() => {
    getGeoi();
    newTask(getGeoi, 8000)
});

onBeforeUnmount(() => {
    timerSetters.forEach(timer => clearInterval(timer))
})
</script>

<template>
    <div class="ax-geoi-main">
        <div class="ax-geoi-main__bg"> </div>
        <div class="ax-geoi-main__content">
            <div class="left-quote">『</div>
            <div class="ax-geoi-main__content_word">
                {{ geoiContent }}
            </div>
            <div class="right-quote">』</div>
            <div class="ax-geoi-main__content_append">——{{ geoiSourceAuthor }}「{{ geoiSource }}」</div>
        </div>
        <div class="ax-geoi-main__footer">
            CopyRight &copy; {{ new Date().getFullYear() }} Abstrax.
        </div>
    </div>
</template>

<style>
@font-face {
    font-family: 'bykt';
    src: url('@/assets/bykt.ttf') format('truetype');
    font-style: normal;
}

.ax-geoi-main {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: #f5f5f5;
}

.ax-geoi-main__bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-image: url('@/assets/bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.ax-geoi-main__bg::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
}

.ax-geoi-main__content {
    position: relative;
    z-index: 1;
    padding: 25px;
    border-radius: 5px;

    line-height: 3.75rem;
    font-family: "bykt";

    width: 55%;
    text-align: center;
}

.ax-geoi-main__content .ax-geoi-main__content_word {
    font-size: 2.8rem;
    font-weight: bold;
}

.left-quote {
    position: absolute;
    top: 0;
    left: -20px;
    font-size: 2.4rem;
    font-weight: bold;
}

.right-quote {
    position: absolute;
    bottom: 0;
    right: -20px;
    font-size: 2.4rem;
    font-weight: bold;
}

.ax-geoi-main__content .ax-geoi-main__content_append {
    position: absolute;
    margin-top: 35px;
    right: 0;
    font-size: 28px;
    font-weight: bold;
    color: #666;
}

.ax-geoi-main__footer {
    position: absolute;
    bottom: 0;
    right: 10px;
    padding: 10px 0;
    font-size: 14px;
    color: #666;
}

@media screen and (max-width: 768px) {
    .ax-geoi-main__content {
        max-width: calc(95% - 4rem - 40px);
        padding: 20px 8px;
    }

    .left-quote,
    .right-quote {
        font-size: 1.6rem;
    }

    .ax-geoi-main__content .ax-geoi-main__content_word {
        font-size: 1.8rem !important;
        line-height: 2.5rem;
    }

    .ax-geoi-main__content .ax-geoi-main__content_append {
        margin-top: 12px;
        font-size: 20px;
    }
}
</style>
