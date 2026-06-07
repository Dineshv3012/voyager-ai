// SocialPage.tsx
import { useQuery } from '@tanstack/react-query'
import { socialAPI } from '../api/client'
export function SocialPage() {
  const { data } = useQuery({ queryKey: ['feed'], queryFn: () => socialAPI.feed().then(r => r.data) })
  const posts: any[] = data?.posts || []
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#b65c00,#c96e1c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="material-symbols-outlined fill" style={{ color: 'white', fontSize: 22 }}>rss_feed</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Travel Feed</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {posts.map((post: any) => (
          <div key={post.id} style={{ background: 'white', borderRadius: 18, border: '1px solid #e4e1ee', overflow: 'hidden' }}>
            {post.media_urls?.[0] && <div style={{ height: 200, backgroundImage: `url(${post.media_urls[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />}
            <div style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 99, background: 'linear-gradient(135deg,#4d41df,#675df9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13 }}>T</div>
                <div><div style={{ fontWeight: 700, fontSize: 14 }}>TravelUser_{post.id.slice(-4)}</div><div style={{ fontSize: 11, color: '#777587' }}>📍 {post.location}</div></div>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: 14, lineHeight: 1.5 }}>{post.caption}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                {post.tags?.map((t: string) => <span key={t} style={{ fontSize: 12, color: '#4d41df' }}>#{t}</span>)}
              </div>
              <div style={{ display: 'flex', gap: 16, borderTop: '1px solid #f0ecf9', paddingTop: 10 }}>
                <button onClick={() => socialAPI.likePost(post.id)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: '#464555', fontSize: 13, fontWeight: 500 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>favorite</span>{post.likes}
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: '#464555', fontSize: 13, fontWeight: 500 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat_bubble</span>Comment
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: '#464555', fontSize: 13, fontWeight: 500 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>share</span>Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default SocialPage
