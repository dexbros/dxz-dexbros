/** @format */

require("dotenv").config();
const Aerospike = require("aerospike");
const { defineAerospikeClient, getAerospikeClient } = require("./aerospike");

const CreateIndex = (config) => {
  var Namespace = process.env.CLUSTER_NAME;
  var setPrefix = "soc_";
  var indexPrefix = "soc_";
  var objs = [
    // Social media users
    {
      ns: Namespace,
      set: process.env.SET_USERS,
      bin: "d_u",
      index: `${indexPrefix}d_u`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_USERS,
      bin: "s_t_f",
      index: `${indexPrefix}s_t_df`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_USERS,
      bin: "s_t_u",
      index: `${indexPrefix}s_t_du`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_USERS,
      bin: "handleUn",
      index: `${indexPrefix}handleUn`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_USERS,
      bin: "log_un",
      index: `${indexPrefix}log_un`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_USER_META,
      bin: "handleUn",
      index: `${indexPrefix}h_un`,
      datatype: Aerospike.indexDataType.STRING,
    },

    // Posts index
    {
      ns: Namespace,
      set: process.env.SET_POSTS,
      bin: "u_dun",
      index: `${indexPrefix}u_dun`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_POSTS,
      bin: "id",
      index: `${indexPrefix}id`,
      datatype: Aerospike.indexDataType.STRING,
    },

    // Post meta index
    {
      ns: Namespace,
      set: process.env.SET_POSTS_META,
      bin: "id",
      index: `${indexPrefix}idm`,
      datatype: Aerospike.indexDataType.STRING,
    },

    // Post search index
    {
      ns: Namespace,
      set: process.env.SET_POSTS_SEARCH,
      bin: "f_t",
      index: `${indexPrefix}f_t`,
      datatype: Aerospike.indexDataType.STRING,
    },

    // Post comment index
    {
      ns: Namespace,
      set: process.env.SET_POST_COMMENT,
      bin: "postId",
      index: `${indexPrefix}postId`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_POST_COMMENT,
      bin: "id",
      index: `${indexPrefix}pcmnt_id`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_POST_COMMENT_META,
      bin: "id",
      index: `${indexPrefix}c_meta_id`,
      datatype: Aerospike.indexDataType.STRING,
    },

    // MAIN POST
    {
      ns: Namespace,
      set: process.env.SET_MAIN_POSTS,
      bin: "m_p_id",
      index: `${indexPrefix}m_p_id`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_MAIN_POSTS,
      bin: "id",
      index: `${indexPrefix}m_p_id`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_MAIN_POSTS,
      bin: "m_p_id",
      index: `${indexPrefix}m`,
      datatype: Aerospike.indexDataType.STRING,
    },

    // Comment Reply
    {
      ns: Namespace,
      set: process.env.SET_POST_REPLY,
      bin: "id",
      index: `${indexPrefix}r_id`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_POST_REPLY,
      bin: "cmntId",
      index: `${indexPrefix}r_cmntId`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_POST_REPLY_META,
      bin: "id",
      index: `${indexPrefix}r_m_id`,
      datatype: Aerospike.indexDataType.STRING,
    },

    // Block index
    {
      ns: Namespace,
      set: process.env.SET_GROUP,
      bin: "g_id",
      index: `${indexPrefix}g_id`,
      datatype: Aerospike.indexDataType.STRING,
    },

    // Block meta index
    {
      ns: Namespace,
      set: process.env.SET_GROUP_META,
      bin: "g_id",
      index: `${indexPrefix}g_id`,
      datatype: Aerospike.indexDataType.STRING,
    },

    // Block search index
    {
      ns: Namespace,
      set: process.env.SET_GROUP_SEARCH,
      bin: "s_t",
      index: `${indexPrefix}s_t`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_GROUP_SEARCH,
      bin: "b_n",
      index: `${indexPrefix}b_n`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_GROUP_SEARCH,
      bin: "s_t_u",
      index: `${indexPrefix}s_t_u`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_GROUP_SEARCH,
      bin: "s_t_f",
      index: `${indexPrefix}s_t_f`,
      datatype: Aerospike.indexDataType.STRING,
    },

    // Block posts index
    {
      ns: Namespace,
      set: process.env.SET_GROUP_POSTS,
      bin: "p_id",
      index: `${indexPrefix}p_id`,
      datatype: Aerospike.indexDataType.STRING,
    },

    // Block main posts index
    {
      ns: Namespace,
      set: process.env.SET_MAIN_GROUP_POST,
      bin: "p_id",
      index: `${indexPrefix}po_id`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_MAIN_GROUP_POST,
      bin: "c_id",
      index: `${indexPrefix}c_id`,
      datatype: Aerospike.indexDataType.STRING,
    },

    // Block posts meta index
    {
      ns: Namespace,
      set: process.env.SET_GROUP_POST_META,
      bin: "p_id",
      index: `${indexPrefix}pid`,
      datatype: Aerospike.indexDataType.STRING,
    },

    // Block posts comment index
    {
      ns: Namespace,
      set: process.env.SET_GROUP_POST_COMMENT,
      bin: "c_id",
      index: `${indexPrefix}cmnt_id`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_GROUP_POST_COMMENT,
      bin: "postID",
      index: `${indexPrefix}postID`,
      datatype: Aerospike.indexDataType.STRING,
    },

    // Block event index
    {
      ns: Namespace,
      set: process.env.SET_BLOCK_EVENT,
      bin: "e_id",
      index: `${indexPrefix}e_id`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_BLOCK_EVENT,
      bin: "b_id",
      index: `${indexPrefix}block_id`,
      datatype: Aerospike.indexDataType.STRING,
    },

    // Trending post index
    {
      ns: Namespace,
      set: process.env.SET_TRENDING,
      bin: "p_k",
      index: `${indexPrefix}p_k`,
      datatype: Aerospike.indexDataType.STRING,
    },

    // Blockcast index
    {
      ns: Namespace,
      set: process.env.SET_BLOCKCAST,
      bin: "b_c_un",
      index: `${indexPrefix}b_c_un`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_BLOCKCAST,
      bin: "isGroup",
      index: `${indexPrefix}isGroup`,
      datatype: Aerospike.indexDataType.STRING,
    },
    {
      ns: Namespace,
      set: process.env.SET_BLOCKCAST,
      bin: "b_id",
      index: `${indexPrefix}b_id`,
      datatype: Aerospike.indexDataType.STRING,
    },

    // Blockcast search index
    {
      ns: Namespace,
      set: process.env.SET_BLOCKCAST_SEARCH,
      bin: "p_k",
      index: `${indexPrefix}b_p_k`,
      datatype: Aerospike.indexDataType.STRING,
    },

    // Earning
    {
      ns: Namespace,
      set: process.env.SET_EARNING,
      bin: "postId",
      index: `${indexPrefix}e_p_id`,
      datatype: Aerospike.indexDataType.STRING,
    },

    {
      ns: Namespace,
      set: process.env.SET_APP_HISTORY,
      bin: "n_id",
      index: `${indexPrefix}n_id`,
      datatype: Aerospike.indexDataType.STRING,
    },

    {
      ns: Namespace,
      set: process.env.SET_APP_HISTORY,
      bin: "r_id",
      index: `${indexPrefix}r_id`,
      datatype: Aerospike.indexDataType.STRING,
    },
  ];

  for (var i = 0; i < objs.length; i++) {
    var options = {
      ns: objs[i].ns,
      set: objs[i].set,
      bin: objs[i].bin,
      index: objs[i].index,
      datatype: objs[i].datatype,
    };
    config.createIndex(options, function (error, job) {
      if (error) {
        // error creating index
        console.log("error creating index......", error);
      }
      job.waitUntilDone(function (error) {
        console.log("Index was created successfully......");
      });
    });
  }
};

async function Main() {
  const config = await getAerospikeClient();
  CreateIndex(config);
}

Main();
