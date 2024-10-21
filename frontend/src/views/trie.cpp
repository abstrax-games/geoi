#include <cstdio>
#include <cstring>

#define root 1  // 根节点就是1号节点

using namespace std;

int n, m;
// s就是字符串的列表，t是要查找的字符串
// s中一共有n个字符串，然后要从s中查找是否有一个字符串和t是一样的。
char s[30]; // 30是s的长度
char t[30];

// 这个就是trie树的结点
int tot = 1; // 这个tot就是目前trie树的总的结点的个数
// trie记录的是子节点的编号
int trie[1000005][30];
// cnt就是trie树结点结束标记的个数
int cnt[1000005];

// 把字符串s插入到trie树中
void insert(char *s) {
    int len = strlen(s);
    // root是根节点的编号
    // now是当前节点的编号
    int now = root; 
    for (int i = 0; i < len; ++i) {
        printf("%d ", now);
        // C++中字符是ASCII码，所以减去'a'就是0~25
        int c = s[i] - 'a';
        // trie树还没有这个节点，就新建一个
        // trie[now][c] 指的是 以 now这个节点 以c为子节点的编号
        if (trie[now][c] == 0) {
            trie[now][c] = ++tot;
        }

        now = trie[now][c];
    }
    printf("%d\n", now);
    // 最后now就是字符串s的最后一个字符对应的结点的编号
    // 最后再打个结束标记
    cnt[now]++;
}

// 查找字符串s是否在trie树中
bool query(char *s) {
    int len = strlen(s);
    int now = root;
    for (int i = 0; i < len; ++i) {
        printf("%d ", now);
        // 先看trie树中有没有这个节点
        int c = s[i] - 'a';
        if (trie[now][c] == 0) {
            // 没有这个节点，就返回false，s不在trie树中
            return false;
        }
        // 否则就继续往下走
        now = trie[now][c];
    }
    printf("%d\n", now);

    // 然后看有没有以这个节点为结尾的字符串
    if (cnt[now] > 0) {
        return true;
    }
    // 没有以这个节点为结尾的字符串，就返回false
    return false;
}

int main() {
    scanf("%d", &n);
    for (int i = 0; i < n; ++i) {
        // 读入n个字符串，然后一个一个插入到trie树中
        scanf("%s", s);
        insert(s);
    }
    // 一共有m组查询
    scanf("%d", &m);
    for (int i = 0; i < m; ++i) {
        scanf("%s", t);
        // 如果s_0~s_{n-1}中有一个和t一样，就输出 Yes
        // 否则就输出 No
        if (query(t)) {
            printf("Yes\n");
        } else {
            printf("No\n");
        }
    }
    return 0;
}