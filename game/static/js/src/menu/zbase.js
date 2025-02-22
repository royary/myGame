class gameMenu{
    constructor(root){
    this.root = root;
    this.$menu = $(`
<div class="my-game-menu">
</div>
`);
this.root.$my_game.append(this.$menu);
    }
}