// @flow strict
import React from 'react';
import { Link } from 'gatsby';
import Comments from './Comments';
import Content from './Content';
import Meta from './Meta';
import Tags from './Tags';
import styles from './Post.module.scss';
import type { Node } from '../../types';

type Props = {
  post: Node,
  next?: Node,
  prev?: Node
};

const Post = ({ post, next, prev }: Props) => {
  const { html } = post;
  const { tagSlugs, slug } = post.fields;
  const { tags, title, date } = post.frontmatter;

  return (
    <div className={styles['post']}>
      <Link className={styles['post__home-button']} to="/">&lt; Home</Link>

      <div className={styles['post__content']}>
        <Content body={html} title={title} />
      </div>

      <div className={styles['post__footer']}>
        <Meta date={date} />
        {tags && tagSlugs && <Tags tags={tags} tagSlugs={tagSlugs} />}
      </div>

      <div className={styles['post__comments']}>
        <Comments postSlug={slug} postTitle={post.frontmatter.title} />
      </div>

      <div className={styles['post__links']}>
        {prev && (
            <div className={styles['post__links__prev']}>
              <Link to={prev.node.fields.slug} rel="prev"> ← {prev.node.frontmatter.title} </Link>
            </div>
        )}
        {next && (
          <div className={styles['post__links__next']}>
            <Link to={next.node.fields.slug} rel="next"> {next.node.frontmatter.title} → </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
