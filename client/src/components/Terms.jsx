import blogStyle from "../styles/blog.module.css"

function Terms() {
	return (
		<div className={blogStyle.termWhole}>
			<h2>ご利用に際して</h2>
			<ol>
				<li>このサイトは試験運用中です．今後正式版のリリースを予定しておりますが，その際の各種変更に伴い登録された情報を消去する可能性が非常に高く．そのため，サーバに登録された情報の消失に関してサイト管理者は一切の責任を負いかねます．</li>
				<li>このサイトはセキュリティ専門家が見れば卒倒するような脆弱性祭りです．そのため，要求されるすべての情報に関して，決してご自身が特定され得る詳細な情報を入力しないでください．</li>
				<li>このサイトは Cookie と JavaScript を利用しておりますので，利用される際はその旨ご承知ください．</li>
				<li>予期しない動作，例えばツールを利用した操作や順序を無視した操作，を行われますとサーバが停止します．操作は順序を守り，画面からアクセスできる操作に留めるようお願いします．</li>
				<li>このサイトを通じて受けた損害をサイト管理者は一切負いません．</li>
			</ol>
			<h3>以上の点にすべてご同意いただける場合のみ当サイトをご利用ください．</h3>
			<div className={blogStyle.center}><a href="/usercreate/" className={blogStyle.link}>戻る</a></div>
			<p className={blogStyle.verySmall}>上記の文を見て</p>
			<p className={blogStyle.verySmall}>「え～，このサイト激ヤバじゃん．やめとこ～」</p>
			<p className={blogStyle.verySmall}>そう思えたあなた！ナイス感性です！！こんなサイト利用するもんじゃありません！！！</p>
			<p className={blogStyle.verySmall}>今すぐに抹殺された某青い鳥(ゲフンゲフン)や，即席通信などを楽しみましょう</p>
		</div>
	)
}

export default Terms;