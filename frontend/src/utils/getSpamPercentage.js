function calculatePercentage(like, spam) {
  if (spam === 0) return 0;
  else if (like === 0 && spam > 0) return 100;
  else if(like === 0  && spam === 0) return 0
  
  const  total = spam*100;
  const result = (total/like);

  return Math.round(result);
};

export default calculatePercentage