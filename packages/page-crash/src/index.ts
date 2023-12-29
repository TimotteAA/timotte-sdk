// 基本思路：利用service worker实现一个心跳机制，插件所在的线程向service worker定时发消息，当service worker收不到后，进行上报
