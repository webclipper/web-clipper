import React from 'react';
import IconFont from '@/components/IconFont';
interface ShareProps {
  content: string;
}
const Share: React.FC<ShareProps> = ({ content: originContent }) => {
  const content = encodeURIComponent(originContent.slice(0, 200));
  const url = encodeURIComponent('https://clipper.website');

  const twitterHref = `https://twitter.com/intent/tweet?via=yuanfandi&text=${content}&url=${url}`;
  const weiboHref = `https://service.weibo.com/share/share.php?url=${url}&title=${content}&display=0`;
  const doubanHref = `https://shuo.douban.com/!service/share?href=${url}&text=${content}`;

  return (
    <div style={{ fontSize: 20 }}>
      <a target="_blank" href={twitterHref}>
        <IconFont type="twitter" />
      </a>
      <a target="_blank" href={weiboHref}>
        <IconFont type="weibo" style={{ marginLeft: 10 }} />
      </a>
      <a target="_blank" href={doubanHref}>
        <IconFont type="douban" style={{ marginLeft: 10 }} />
      </a>
    </div>
  );
};
export default Share;
