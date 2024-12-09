<!--
 * @Description: 
 * @Author: Kevin
 * @Date: 2024-10-29 08:59:26
 * @LastEditors: Kevin
 * @LastEditTime: 2024-10-29 15:17:38
-->
<template>
    <div class='editor'>
        <Editor :cobweb="cobweb"></Editor>
    </div>
</template>
<script>
import Editor from "@/components/Editor.vue"
export default {
    name:"CobwebEditor",
    components: {
        Editor,
    },
    props: {
        cobweb: String
    },
    data() {
        return {

        };
    },
    computed: {

    },
    watch: {

    },
    created() {

    },
    mounted() {

    },
    methods: {

    },
};
</script>

<style scoped lang="scss">
    .editor{
        height: 100%;
        width: 100%;
    }
</style>
