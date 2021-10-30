export default {
  getCurrentBets: async () => {
    const round = await Round.findAll({
      order: [["createdAt", "DESC"]],
    });
    const bets = await Bet.findAll({
      where: {
        roundId: round[0].id,
      },
    });

    return bets;
  },
};
