import Axios from 'axios';
import { useEffect, useState } from 'react';

const fetchGithubFileHookGenerator = (projectName: string) => {
  const useFetchGithubFile = (filePath: string): [boolean, string | null] => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<string | null>(null);
    useEffect(() => {
      let canceled = false;
      setLoading(true);
      Axios.get(`https://api.github.com/repos/${projectName}/contents/${filePath}`).then(re => {
        if (!canceled) {
          const data = decodeURIComponent(escape(window.atob(re.data.content)));
          setLoading(false);
          setFile(data);
        }
      });
      return () => {
        canceled = true;
      };
    }, [filePath]);

    return [loading, file];
  };
  return useFetchGithubFile;
};

export default fetchGithubFileHookGenerator('webclipper/web-clipper');
