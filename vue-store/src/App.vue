<template>
  <div id="app">
    <!-- 所有的页面走缓存，点击相同的缓存，点击不同走请求 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
