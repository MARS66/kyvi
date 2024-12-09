import editor from './cobweb-editor.vue';

editor.install = function(Vue) {
  Vue.component(editor.name, editor);
};

export default editor;
