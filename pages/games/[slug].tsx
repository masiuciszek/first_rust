import {Field, GameSlug} from "@app-types/blog"
import Title from "@components/common/title"
import {TicTacToe} from "@components/tic-tac-toe"
import {css} from "@emotion/react"
import fs from "fs"
import {getPostBySlug} from "lib/api"
import {GetStaticPaths, GetStaticProps} from "next"
import {join} from "path"
import {ParsedUrlQuery} from "querystring"
import {FC, Fragment} from "react"

const renderGame = (slug: GameSlug): JSX.Element => {
  switch (slug) {
    case "quiz":
      return <h1>Quiz</h1>
    case "black-jack":
      return <h1>Black jack</h1>
    case "hangman":
      return <h1>Hangman</h1>
    case "tic-tac-toe":
      return <TicTacToe />
    default:
      throw new Error(`No game found with ${slug}`)
  }
}

interface Result {
  postItem: Record<Field, string | string[]>
}

const GameSlugPage: FC<Result> = ({postItem}): JSX.Element => {
  return (
    <Fragment>
      <Title
        incomingStyles={css`
          text-align: center;
          margin-bottom: 1.5rem;
        `}
      >
        <h1>{postItem.title}</h1>
      </Title>
      {renderGame(postItem.slug as GameSlug)}
    </Fragment>
  )
}

export default GameSlugPage

export const getStaticPaths: GetStaticPaths = async () => {
  const postsPath = join(process.cwd(), "posts")
  const postsSlugs = fs
    .readdirSync(postsPath, "utf-8")
    .map((path) => path.replace(/\.mdx$/, ""))
  return {
    paths: postsSlugs.map((slug) => ({params: {slug}})),
    fallback: false,
  }
}

interface QueryParams extends ParsedUrlQuery {
  slug: string
}

export const getStaticProps: GetStaticProps<Result, QueryParams> = async ({
  params,
}) => {
  const postSlug = params?.slug + ".mdx"
  const postItem = getPostBySlug(postSlug, ["slug", "content", "tags", "title"])

  return {
    props: {
      postItem,
    },
  }
}
