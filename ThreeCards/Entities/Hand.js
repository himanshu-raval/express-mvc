class Hand {
    constructor(player, board) {
        this.player = player;
        this.board = board;
        this.cards = player.concat(board);
    }
}
module.exports  = Hand