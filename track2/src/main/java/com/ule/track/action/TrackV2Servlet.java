package com.ule.track.action;

import com.ule.track.RootLoggerRef;
import com.ule.track.util.URLAnalysis;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Servlet implementation class NewTrackServlet
 */
public class TrackV2Servlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final static Logger DATA_LOG = LoggerFactory.getLogger(TrackV2Servlet.class);
	private final static Logger ERROR_LOG = LoggerFactory.getLogger(RootLoggerRef.class);
	private static String imgcode = "R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEHAAIALAAAAAABAAEAAAICVAEAOw==";
	private static byte[] outcode = null;
//
//	public TrackV2Servlet() {
//		Base64 base64 = new Base64();
//		try {
//			outcode = Base64.decode(imgcode.getBytes());
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		OutputStream out = null;
		try {
			String ip = getIpAddr(request);//客户端ip
			String requestParameter = request.getQueryString();//返回查询字符串，即URL中?后面的部份。
				String userAgent = request.getHeader("User-Agent");//浏览器标识
			String refer = request.getHeader("referer");//获取来源页地址
			String track_event = "";
			if (refer == null || "".equals(refer)) {
				refer = request.getHeader("Referer");
			} else {
				refer = request.getHeader("REFERER");
			}
			SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String time = dateFormat.format(new Date());
			String baklog = requestParameter + "|" + refer + "|" + userAgent + "|" + ip;
			DATA_LOG.info(baklog);

			Map<String, String> map = new HashMap<String, String>();
			map.put("ip", ip);
			map.put("date", time);
			map.put("ua", userAgent);
			map.put("url", requestParameter);
			map.put("referer", refer);
			Map urlMap = URLAnalysis.analysis(requestParameter);
			if (urlMap != null) {
				track_event = (String) urlMap.get("te");
			}
			if (map != null) {
				if (!StringUtils.isBlank(track_event) && "1".equals(track_event)) {
					out = response.getOutputStream();
					response.setStatus(200);
					response.setHeader("Content-Type", "image/gif");
					out.write(outcode);
				} else {
					response.setStatus(204);
					response.setHeader("Content-Type", "application/javascript");
				}
				imgcode = null;
				urlMap = null;
				map = null;
			}
		} catch (Exception e) {
			ERROR_LOG.error("Track V2 Servlet Action Occurs Error:", e);
			throw new RuntimeException(e);
		} finally {
			if (out != null) {
				out.close();
			}
		}
	}

	public String getIpAddr(HttpServletRequest request) {
		String ip = "";
		// 获取客户端IP流程
		ip = request.getHeader("x-forwarded-for");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}

		if (ip != null && ip.length() > 15) {
			if (ip.indexOf(",") > 0) {
				ip = ip.split(",")[0];
			}
		}
		return ip;
	}

}
