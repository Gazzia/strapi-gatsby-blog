import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"
import Moment from "react-moment"
import Layout from "../components/layout"
import Markdown from "react-markdown"

export const query = graphql`
  query ArticleQuery($slug: String!) {
    strapiArticle(slug: { eq: $slug }, status: { eq: "published" }) {
      strapiId
      title
      description
      content
      publishedAt
      image {
        publicURL
        childImageSharp {
          fixed {
            src
          }
        }
      }
      author {
        name
        picture {
          childImageSharp {
            fixed(width: 30, height: 30) {
              src
            }
          }
        }
      }
    }
  }
`

const Article = ({ data }) => {
  const article = data.strapiArticle
  const seo = {
    metaTitle: article.title,
    metaDescription: article.description,
    shareImage: article.image,
    article: true,
  }

  const [comments, setComments] = useState([])

  const getTheCommentaires = () => {
    fetch("https://blog-strapi-simplon.herokuapp.com/comments?article=" + article.strapiId)
      .then(res => res.json())
      .then(data => {
        const bob = data.map(comm => {
          const date = new Date(comm.published_at).toLocaleString("fr")
          return (
            <div className="comment">
              <div className="top">
                <div className="author">{comm.author}</div>
                <div className="published_at">{date}</div>
              </div>
              <div className="value">{comm.value}</div>
            </div>
          )
        })
        setComments(bob)
      })
  }

  const submitForm = (ev, id) => {
	ev.preventDefault()
	console.log("ev :>> ", ev)
	const value = ev.target.commeUnGarconJaiLesCheveuxLongs.value
	const author = ev.target.author.value
	const object = {
	  value,
	  author,
	  article: id,
	}
	fetch("https://blog-strapi-simplon.herokuapp.com/comments", {
	  method: "POST",
	  headers: {
		"content-type": "application/json",
	  },
	  body: JSON.stringify(object),
	})
	  .then(res => res.json())
	  .then(data => {
		console.log("data :>> ", data)
		getTheCommentaires();
	  })
	  .catch(err => console.error)
  }

  useEffect(getTheCommentaires, [article])

  return (
    <Layout seo={seo}>
      <div>
        <div
          id="banner"
          className="uk-height-medium uk-flex uk-flex-center uk-flex-middle uk-background-cover uk-light uk-padding uk-margin"
          data-src={article.image.publicURL}
          data-srcset={article.image.publicURL}
          data-uk-img
        >
          <h1>{article.title}</h1>
        </div>

        <div className="uk-section">
          <div className="uk-container uk-container-small">
            <Markdown source={article.content} escapeHtml={false} />

            <hr className="uk-divider-small" />

            <div className="uk-grid-small uk-flex-left" data-uk-grid="true">
              <div>
                {article.author.picture && (
                  <Img
                    fixed={article.author.picture.childImageSharp.fixed}
                    imgStyle={{ position: "static", borderRadius: "50%" }}
                  />
                )}
              </div>
              <div className="uk-width-expand">
                <p className="uk-margin-remove-bottom">
                  By {article.author.name}
                </p>
                <p className="uk-text-meta uk-margin-remove-top">
                  <Moment format="MMM Do YYYY">{article.published_at}</Moment>
                </p>
              </div>
              <hr />
              <div className="comments">
                <form
                  className="commentForm"
                  onSubmit={ev => submitForm(ev, article.strapiId)}
                >
                  <div className="label">Publier un commentaire:</div>
                  <input type="text" name="author" placeholder="Auteur"></input>
                  <input
                    type="text"
                    name="commeUnGarconJaiLesCheveuxLongs"
                    placeholder="Commentaire"
                  ></input>
                  <button type="submit">Envoyer</button>
                </form>
                {comments}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Article
