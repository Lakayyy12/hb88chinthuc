package lim.jiyeon.hb88chnhthc.hb.eight

import android.content.ContentValues
import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AnimationUtils
import android.widget.Toast
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.fragment.findNavController
import lim.jiyeon.hb88chnhthc.R
import lim.jiyeon.hb88chnhthc.YeonJinActs
import lim.jiyeon.hb88chnhthc.databinding.FragmentFirstBinding
import lim.jiyeon.hb88chnhthc.hb.YeonConnecticut

class FirstFragment : Fragment() {

    private var _binding: FragmentFirstBinding? = null
    private val binding get() = _binding!!

    private val args = Bundle()
    private lateinit var viewmodel: YeonViewCorp
    private var connection = YeonConnecticut()
    private var checknet = false

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentFirstBinding.inflate(inflater, container, false)
        viewmodel = ViewModelProvider(this)[YeonViewCorp::class.java]
        networkConnectionCheck()
        animation()
        return binding.root
    }

    private fun networkConnectionCheck() {
        checknet = connection.connectionError(requireActivity())
        if (checknet) {
            viewmodel.getData()
            btnClick()
        } else {
            Toast.makeText(context, "PLEASE CHECK YOUR INTERNET CONNECTION!!", Toast.LENGTH_SHORT)
                .show()
        }
    }

    private fun animation() {

        val arte = AnimationUtils.loadAnimation(context, R.anim.center_reveal_anim)
        binding.hb1st.startAnimation(arte)
        binding.hb2nd.startAnimation(arte)
        binding.hb3rd.startAnimation(arte)

        val fade = AnimationUtils.loadAnimation(context, R.anim.turn_down)
        binding.banner.startAnimation(fade)

    }

    private fun btnClick() {
        viewmodel.livedataListModel.observe(viewLifecycleOwner) {
            it.let {
                if (it != null) {
                    for (i in it.indices) {
                        val packageName = it[i].yeonthree
                        val webView = it[i].yeonfour
                        val jumpcode = it[i].yeonfive
                        if (packageName == context?.packageName) {
                            Log.e(ContentValues.TAG, packageName.toString())
                            when (jumpcode) {
                                true -> {
                                    binding.hb1st.text = it[i].yeonone
                                    binding.hb2nd.text = it[i].yeontwo
                                    args.putBoolean("code", true)
                                    args.putString("urlview", webView)
                                }
                                else -> {
                                    binding.hb1st.text = getString(R.string.mua1st)
                                    binding.hb2nd.text = getString(R.string.mua2nd)
                                    args.putBoolean("code", false)
                                }
                            }

                            binding.hb1st.setOnClickListener {
                                args.putString("title", "webview")
                                findNavController().navigate(
                                    R.id.action_FirstFragment_to_SecondFragment,
                                    args
                                )
                            }
                            binding.hb2nd.setOnClickListener {
                                args.putString("title", "webview2")
                                findNavController().navigate(
                                    R.id.action_FirstFragment_to_SecondFragment,
                                    args
                                )
                            }
                            binding.hb3rd.setOnClickListener {
                                val intent = Intent(context, YeonJinActs::class.java)
                                startActivity(intent)
                            }
                        }
                    }
                }
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}