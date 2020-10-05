import Butter from 'buttercms';
import Global from '../components/Constants';

async function instance() {
  console.log('butter 1...');

  const tokenButter = await Global.KEYS.BUTTER_TOKEN;
  const butter = Butter(tokenButter);

  console.log('butter 2...');
  console.log(butter);

  return butter;
}

export default instance;
